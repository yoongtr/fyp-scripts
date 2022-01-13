# python train.py --help
# USAGE: python train.py train ../SQuAD-2.0/train-v2.0.json checkpoints best-checkpoint t5-base 10 4 0.0001
# TENSORBOARD: tensorboard --logdir=lightning_logs
# Order of arguments: JSON data path, model save folder path, model save file name, huggingface model choice,
# no of epochs, batch size, learning rate

import typer
import json
import pandas as pd
import torch
from torch.utils.data import Dataset, DataLoader
import pytorch_lightning as pl
from pytorch_lightning.callbacks import ModelCheckpoint
from sklearn.model_selection import train_test_split
from transformers import (
    AdamW,
    T5ForConditionalGeneration,
    T5TokenizerFast as T5Tokenizer
)
pl.seed_everything(42)

app = typer.Typer()

# MODEL_NAME = "t5-base"
# tokenizer = T5Tokenizer.from_pretrained(MODEL_NAME)
# BATCH_SIZE = 4
# N_EPOCHS = 10
# LEARNING_RATE = 0.0001

# Data extraction
@app.command()
def extract_questions_and_answers(path):
    with open(path, 'r') as json_file:
        data = json.load(json_file)
    
    data_rows = []
    for dt in data["data"]:
        questions = dt["paragraphs"]

        for question in questions:
            context = question["context"]
            for qas in question["qas"]:
                question = qas["question"]
                answers = qas["answers"]

                for answer in answers:
                    answer_text = answer["text"]
                    answer_start = answer["answer_start"]
                    answer_end = answer_start + len(answer_text)

                    data_rows.append({
                        "question": question,
                        "context": context,
                        "answer_text": answer_text,
                        "answer_start": answer_start,
                        "answer_end": answer_end
                    })

    df = pd.DataFrame(data_rows)
    df = df.drop_duplicates(subset = ['context']).reset_index(drop=True) # Uncomment if want to keep duplicated contexts
    # df = df.sample(64) # uncomment for testing
    
    return data, df

# Encoding class for all input data 
class AQGDataset(Dataset):

    def __init__(
        self,
        data: pd.DataFrame,
        tokenizer: T5Tokenizer,
        source_max_token_len: int = 396,
        target_max_token_len: int = 64
    ):
        self.tokenizer = tokenizer
        self.data = data
        self.source_max_token_len = source_max_token_len
        self.target_max_token_len = target_max_token_len
  
    def __len__(self):
        return len(self.data)
  
    def __getitem__(self, index: int):
        data_row = self.data.iloc[index]

        source_encoding = self.tokenizer(
          data_row['answer_text'],
          data_row['context'],
          max_length= self.source_max_token_len,
          padding = 'max_length',
          truncation = 'only_second',
          return_attention_mask = True,
          add_special_tokens = True,
          return_tensors = 'pt'
        )
    
        target_encoding = self.tokenizer(
          data_row['question'],
          max_length= self.target_max_token_len,
          padding = 'max_length',
          truncation = True,
          return_attention_mask = True,
          add_special_tokens = True,
          return_tensors = 'pt'
        )

        labels = target_encoding['input_ids']
        labels[labels == 0] = -100
    
        return dict(
            question = data_row['question'],
            context = data_row['context'],
            answer_text = data_row['answer_text'],
            input_ids = source_encoding['input_ids'].flatten(),
            attention_mask = source_encoding['attention_mask'].flatten(),
            labels = labels.flatten()
        )

# Create dataloaders for the encoded input data
class AQGDataModule(pl.LightningDataModule):

    def __init__(
      self,
      train_df: pd.DataFrame,
      test_df: pd.DataFrame,
      tokenizer: T5Tokenizer,
      data,
      batch_size: int = 4,
      source_max_token_len: int = 396,
      target_max_token_len: int = 64
    ):
        super().__init__()
        self.batch_size = batch_size
        self.train_df = train_df
        self.test_df = test_df
        self.tokenizer = tokenizer
        self.data = data
        self.source_max_token_len = source_max_token_len
        self.target_max_token_len = target_max_token_len
  
    def setup(self):
        self.train_dataset = AQGDataset(
            self.train_df,
            self.tokenizer,
            self.source_max_token_len,
            self.target_max_token_len
        )
    
        self.test_dataset = AQGDataset(
            self.test_df,
            self.tokenizer,
            self.source_max_token_len,
            self.target_max_token_len
        )

    def train_dataloader(self):
        return DataLoader(
            self.train_dataset,
            batch_size = self.batch_size,
            shuffle = True,
            num_workers = 4
        )
  
    def val_dataloader(self):
        return DataLoader(
            self.test_dataset,
            batch_size = 1,
            num_workers = 4
        )

    def test_dataloader(self):
        return DataLoader(
            self.test_dataset,
            batch_size = 1,
            num_workers = 4
        )

# Model design
class AQGModel(pl.LightningModule):

    def __init__(self, model_name, batch_size, learning_rate):
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

# Training
@app.command()
def train(jsondata, dirpath, filename, model_name, n_epochs, batch_size, learning_rate):
    n_epochs = int(n_epochs)
    batch_size = int(batch_size)
    learning_rate = float(learning_rate)
    data, df = extract_questions_and_answers(jsondata)
    train_df, val_df = train_test_split(df, test_size = 0.1)
    tokenizer = T5Tokenizer.from_pretrained(model_name)
    data_module = AQGDataModule(train_df, val_df, tokenizer, data, batch_size=batch_size)
    data_module.setup()
    model = AQGModel(model_name=model_name, batch_size=batch_size, learning_rate=learning_rate)
    # print(model.config)
    checkpoint_callback = ModelCheckpoint(
        dirpath = dirpath,
        filename = filename,
        save_top_k = 1,
        verbose = True,
        monitor = 'val_loss',
        mode = 'min'
    )
    trainer = pl.Trainer(
        callbacks = [checkpoint_callback],
        max_epochs = int(n_epochs),
        gpus = 1,
        progress_bar_refresh_rate=30
    )
    print("\n\n----------TRAINING STARTS----------")
    trainer.fit(model, data_module)
    print("\n\n----------TRAINING DONE.----------")
    print("\n\n----------TESTING LOSS----------")
    trainer.test(model, data_module)

if __name__ == "__main__":
    app()
