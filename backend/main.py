import fastapi as _fastapi
import fastapi.security as _security
import sqlalchemy.orm as _orm
import services as _services, schemas as _schemas
from typing import List
import pytorch_lightning as pl
from pytorch_lightning.callbacks import ModelCheckpoint
from transformers import (
    AdamW,
    T5ForConditionalGeneration,
    T5TokenizerFast as T5Tokenizer
)

app = _fastapi.FastAPI()


@app.post("/api/users")
async def create_user(
    user: _schemas.UserCreate, db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    db_user = await _services.get_user_by_email(user.email, db)
    if db_user:
        raise _fastapi.HTTPException(status_code=400, detail="Email already existed. Please sign in or choose another email.")
    user = await _services.create_user(user, db)
    return await _services.create_token(user)

@app.post("/api/token")
async def generate_token(
    form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    user = await _services.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise _fastapi.HTTPException(status_code=401, detail="Username or password is incorrect.")
    return await _services.create_token(user)

@app.get("/api/users/me", response_model=_schemas.User)
async def get_user(user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return user

@app.post("/api/leads", response_model=_schemas.Lead)
async def create_lead(
    lead: _schemas.LeadCreate,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_lead(user=user, db=db, lead=lead)

@app.get("/api/leads", response_model=List[_schemas.Lead])
async def get_leads(
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_leads(user=user, db=db)

@app.get("/api/leads/{lead_id}", status_code=200) # returns individual lead
async def get_lead(
    lead_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_lead(lead_id, user, db)

@app.delete("/api/leads/{lead_id}", status_code=204)
async def delete_lead(
    lead_id: int,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    await _services.delete_lead(lead_id, user, db)
    return {"message", "Successfully Deleted"}

@app.put("/api/leads/{lead_id}", status_code=200)
async def update_lead(
    lead_id: int,
    lead: _schemas.LeadCreate,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    await _services.update_lead(lead_id, lead, user, db)
    return {"message", "Successfully Updated"}

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

@app.post("/api/prediction")
async def get_predict(data: _schemas.Candidate):
    # sample = data.input_passage
    # addition = "aaa..."
    # combined = addition + sample
    # return combined
    pretrained_model = "t5-base"
    modelpath = "/Users/yoongtran/Desktop/FYP-scripts/model/20220120_0-best-checkpoint.ckpt"
    tokenizer = T5Tokenizer.from_pretrained(pretrained_model)
    summarizer = T5ForConditionalGeneration.from_pretrained(pretrained_model)
    trained_model = AQGModel(model_name=pretrained_model).load_from_checkpoint(modelpath)
    trained_model.freeze()
    input_dict = dict()

    input_dict['context'] = data.input_passage
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
