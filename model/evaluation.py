# This script is to be used with BLEU repository: https://github.com/neural-dialogue-metrics/BLEU
import bleu
import json

squad_for_eval = "path-to-squad-for-eval.json"
inference = "path-to-inference.txt"

with open(squad_for_eval, 'r') as f:
    test_dict = json.load(f)

with open(inference, 'r') as f:
    inferences = f.read().splitlines()

translation_corpus = [i.split() for i in inferences]
reference_corpus = []
for t in list(test_dict.values())[:20]: # change to the number of sample data used
    reference_corpus.append([ref.split() for ref in t])

score = bleu.bleu_corpus_level(
    translation_corpus=translation_corpus,
    reference_corpus=reference_corpus
)

print(score)