# Model and pipeline files

## Model and training
* After training, the model file `.ckpt` should be saved in this folder
* The CLI app to train and infer is `pipeline.py`. CLI usage guide is at the top comment lines of the file.

## Prepare data for inference
* Data should be similar to SQuAD data format
* Run `create_eval_data.py` to generate the JSON data file that can be read by the pipeline. Remember to change the path names of `create_eval_data.py`.

## Inference and evaluation
* There are two types of dev sets for inference - one is the original dev set from SQuAD 2.0 and the other one is the Xinya Du's extracted SQuAD. I already generated the two files as `squad_for_eval.json` and `squad_du_for_eval.json` respectively.
* Infer using the infer-with-file flag from pipeline.py
* For evaluation, I use BLEU-4 score from https://github.com/neural-dialogue-metrics/BLEU . Clone the repo and run the `evaluation.py` script inside the repo's folder. Remember to change the file paths accordingly.