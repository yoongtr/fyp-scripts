from urllib import response
import fastapi as fastapi
import fastapi.security as security
import sqlalchemy.orm as orm
import crud as crud, schemas as schemas
from typing import List
import pytorch_lightning as pl
from pytorch_lightning.callbacks import ModelCheckpoint
from transformers import (
    AdamW,
    T5ForConditionalGeneration,
    T5TokenizerFast as T5Tokenizer
)

app = fastapi.FastAPI()

@app.post("/api/users")
async def create_user(
    user: schemas.UserCreate, db: orm.Session = fastapi.Depends(crud.get_db)
):
    db_user = await crud.get_user_by_email(user.email, db)
    if db_user:
        raise fastapi.HTTPException(status_code=400, detail="Email already existed. Please sign in or choose another email.")
    user = await crud.create_user(user, db)
    return await crud.create_token(user)

@app.post("/api/token")
async def generate_token(
    form_data: security.OAuth2PasswordRequestForm = fastapi.Depends(),
    db: orm.Session = fastapi.Depends(crud.get_db),
):
    user = await crud.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise fastapi.HTTPException(status_code=401, detail="Username or password is incorrect.")
    return await crud.create_token(user)

@app.get("/api/users/me", response_model=schemas.User)
async def get_user(user: schemas.User = fastapi.Depends(crud.get_current_user)):
    return user

@app.get("/api/users", response_model=List[schemas.User])
async def read_users(
    skip: int = 0, 
    limit: int = 30, 
    user: schemas.User = fastapi.Depends(crud.get_current_user),
    db: orm.Session = fastapi.Depends(crud.get_db)):

    users = await crud.get_users(db=db, user=user, skip=skip, limit=limit)
    return users

@app.delete("/api/users/{user_id}", status_code=204)
async def delete_user(
    user_id: int,
    user: schemas.User = fastapi.Depends(crud.get_current_user),
    db: orm.Session = fastapi.Depends(crud.get_db)
):
    await crud.delete_user(user_id, user, db)
    return {"message", "Successfully Deleted."}

@app.put("/api/users/{user_id}", status_code=200)
async def update_user(
    user_id: int,
    user_updated: schemas.UserCreate,
    user: schemas.User = fastapi.Depends(crud.get_current_user),
    db: orm.Session = fastapi.Depends(crud.get_db)
):
    await crud.update_user(
        user_id=user_id, 
        user_updated=user_updated,
        user=user,
        db=db)
    return {"message", "Successfully Updated"}

@app.put("/api/users/{user_id}/newrank", status_code=200)
async def update_rank(
    user_id: int,
    user: schemas.User = fastapi.Depends(crud.get_current_user),
    db: orm.Session = fastapi.Depends(crud.get_db)
):
    await crud.update_rank(
        user_id=user_id, 
        user=user,
        db=db)
    return {"message", "Successfully Updated"}

@app.post("/api/quiz", response_model=schemas.Quiz)
async def create_quiz(
    quiz: schemas.QuizCreate,
    user: schemas.User = fastapi.Depends(crud.get_current_user),
    db: orm.Session = fastapi.Depends(crud.get_db)
):
    return await crud.create_quiz(user=user, db=db, quiz=quiz)

@app.get("/api/allquizzes", response_model=List[schemas.Quiz])
async def read_quizzes(
    skip: int = 0, 
    limit: int = 30, 
    user: schemas.User = fastapi.Depends(crud.get_current_user),
    db: orm.Session = fastapi.Depends(crud.get_db)):

    quizzes = await crud.get_quizzes(db=db, user=user, skip=skip, limit=limit)
    return quizzes

@app.get("/api/quiz", response_model=List[schemas.Quiz])
async def read_my_quizzes(
    skip: int = 0, 
    limit: int = 30, 
    user: schemas.User = fastapi.Depends(crud.get_current_user),
    db: orm.Session = fastapi.Depends(crud.get_db)):

    quizzes = await crud.get_my_quizzes(db=db, user=user, skip=skip, limit=limit)
    return quizzes

@app.get("/api")
async def root():
    return {"message": "Welcome to the API"}

# Model design
class AQGModel(pl.LightningModule):

    def __init__(self, model_name="t5-base", batch_size=None, learning_rate=None):
        super().__init__()
        self.model = T5ForConditionalGeneration.from_pretrained(model_name, return_dict = True)
        self.batch_size = batch_size
        self.learning_rate = learning_rate

    def forward(self, input_ids, attention_mask, labels = None):
        output = self.model(
            input_ids = input_ids,
            attention_mask = attention_mask,
            labels = labels
        )

        return output.loss, output.logits

    def training_step(self, batch, batch_idx):
        input_ids = batch['input_ids']
        attention_mask = batch['attention_mask']
        labels = batch['labels']
        loss, outputs = self(input_ids, attention_mask, labels)
        self.log("train_loss", loss, prog_bar = True, logger = True, batch_size=self.batch_size)
        return loss
  
    def validation_step(self, batch, batch_idx):
        input_ids = batch['input_ids']
        attention_mask = batch['attention_mask']
        labels = batch['labels']
        loss, outputs = self(input_ids, attention_mask, labels)
        self.log("val_loss", loss, prog_bar = True, logger = True, batch_size=self.batch_size)
        return loss

    def test_step(self, batch, batch_idx):
        input_ids = batch['input_ids']
        attention_mask = batch['attention_mask']
        labels = batch['labels']
        loss, outputs = self(input_ids, attention_mask, labels)
        self.log("test_loss", loss, prog_bar = True, logger = True, batch_size=self.batch_size)
        return loss

    def configure_optimizers(self):
        return AdamW(self.parameters(), lr=self.learning_rate)

def generate_question(answer, tokenizer, trained_model):
    source_encoding = tokenizer(
      answer['answer_text'],
      answer['context'],
      max_length = 396,
      padding = 'max_length',
      truncation = 'only_second',
      return_attention_mask = True,
      add_special_tokens = True,
      return_tensors = 'pt'
    )
    generated_ids = trained_model.model.generate(
      input_ids = source_encoding['input_ids'],
      attention_mask = source_encoding['attention_mask'],
      num_beams = 1,
      max_length = 80,
      repetition_penalty = 2.5,
      length_penalty = 1.0,
      early_stopping = True,
      use_cache = True
    )

    preds = [
      tokenizer.decode(generated_id, skip_special_tokens = True, clean_up_tokenization_spaces = True)
      for generated_id in generated_ids
    ]

    return "".join(preds)

pretrained_model = "t5-base"
modelpath = "/Users/yoongtran/Desktop/FYP-scripts/model/20220120_0-best-checkpoint.ckpt"
tokenizer = T5Tokenizer.from_pretrained(pretrained_model)
summarizer = T5ForConditionalGeneration.from_pretrained(pretrained_model)
trained_model = AQGModel(model_name=pretrained_model).load_from_checkpoint(modelpath)
trained_model.freeze()

def single_prediction(text: str):
    input_dict = dict()

    input_dict['context'] = text
    input_ids = tokenizer(
        "summarize: " + input_dict['context'],
        return_tensors = "pt",
    ).input_ids
    outputs = summarizer.generate(input_ids,
                            min_length=3,
                            max_length=10)
    input_dict['answer_text'] = tokenizer.decode(outputs[0], 
                            skip_special_tokens=True, 
                            clean_up_tokenization_spaces=True)
    gen_qn = generate_question(input_dict, tokenizer=tokenizer, trained_model=trained_model)
    return input_dict['answer_text'], gen_qn

@app.post("/api/prediction")
async def get_predict(data: schemas.Candidate):
    # pretrained_model = "t5-base"
    # modelpath = "/Users/yoongtran/Desktop/FYP-scripts/model/20220120_0-best-checkpoint.ckpt"
    # tokenizer = T5Tokenizer.from_pretrained(pretrained_model)
    # summarizer = T5ForConditionalGeneration.from_pretrained(pretrained_model)
    # trained_model = AQGModel(model_name=pretrained_model).load_from_checkpoint(modelpath)
    # trained_model.freeze()
    ans, qn = single_prediction(data.input_passage)
    return ans, qn

@app.post("/api/generatequiz/{input_no}")
async def generate_quiz(input_no: int, data: schemas.Candidate):
    text = data.input_passage
    sent_list = text.replace("\n", " ").split(". ")
    no_qn = input_no
    if len(sent_list)==1:
        splitted_joined = sent_list
    else:
        sent_per_qn = len(sent_list)//no_qn
        splitted = []
        for i in range(no_qn-1):
            splitted.append(sent_list[i*sent_per_qn:(i+1)*sent_per_qn])
        splitted.append(sent_list[i*sent_per_qn:])
        splitted_joined = []
        for s in splitted:
            splitted_joined.append('. '.join(s)+'.')

    result_arr = []
    for sj in splitted_joined:
        pair_list = []
        ans, qn = single_prediction(sj)
        pair_list.append(ans)
        pair_list.append(qn)
        result_arr.append(pair_list)

    return result_arr


