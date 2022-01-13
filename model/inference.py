import typer
import torch
import pytorch_lightning as pl
from transformers import (
    AdamW,
    T5ForConditionalGeneration,
    T5TokenizerFast as T5Tokenizer
)
pl.seed_everything(42)

app = typer.Typer()

MODEL_NAME = "t5-base"
tokenizer = T5Tokenizer.from_pretrained(MODEL_NAME)
BATCH_SIZE = 4
N_EPOCHS = 10
LEARNING_RATE = 0.0001


# Model design
class AQGModel(pl.LightningModule):

    def __init__(self):
        super().__init__()
        self.model = T5ForConditionalGeneration.from_pretrained(MODEL_NAME, return_dict = True)

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
        self.log("train_loss", loss, prog_bar = True, logger = True, batch_size=BATCH_SIZE)
        return loss
  
    def validation_step(self, batch, batch_idx):
        input_ids = batch['input_ids']
        attention_mask = batch['attention_mask']
        labels = batch['labels']
        loss, outputs = self(input_ids, attention_mask, labels)
        self.log("val_loss", loss, prog_bar = True, logger = True, batch_size=BATCH_SIZE)
        return loss

    def test_step(self, batch, batch_idx):
        input_ids = batch['input_ids']
        attention_mask = batch['attention_mask']
        labels = batch['labels']
        loss, outputs = self(input_ids, attention_mask, labels)
        self.log("test_loss", loss, prog_bar = True, logger = True, batch_size=BATCH_SIZE)
        return loss

    def configure_optimizers(self):
        return AdamW(self.parameters(), lr=LEARNING_RATE)


# Inference helper function
def generate_question(answer, trained_model):
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

# Inference with answers given
@app.command()
def inference_with_answers(sample_answer):
    trained_model = AQGModel.load_from_checkpoint("checkpoints/best-checkpoint.ckpt")
    trained_model.freeze()
    qn = generate_question(sample_answer, trained_model)
    print(qn)
