import random
import json

squad_for_eval = "/Users/yoongtran/Desktop/FYP-scripts/model/squad_du_for_eval.json"
inference = "/Users/yoongtran/Desktop/FYP-scripts/model/20220120_0_squaddu_inference.txt"

with open(squad_for_eval, 'r') as f:
    test_dict = json.load(f)

with open(inference, 'r') as f:
    inferences = f.read().splitlines()

reference_corpus = []
for t in list(test_dict.values()):
    reference_corpus.append([ref for ref in t])

contexts = []
for c in list(test_dict.keys()):
    contexts.append(c)

res = [random.randrange(1, 2429, 1) for i in range(5)] # randomise 5 predictions to view

for r in res:
    print("\n\n\nSample no. " + str(r))
    print("\nContext: ")
    print(contexts[r])
    print("\nReferences: ")
    print(reference_corpus[r])
    print("\nInference: ")
    print(inferences[r])