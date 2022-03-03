import json

def create_json_data(squad_test):
    with open(squad_test, 'r') as json_file:
        data = json.load(json_file)

    data_dict = {}

    for dt in data["data"]:
        paragraphs = dt["paragraphs"]

        for questions in paragraphs:
            context = questions["context"]
            qn_list = []
            for qas in questions["qas"]:
                qn_list.append(qas["question"])
            data_dict[context] = qn_list

    with open("squad_for_eval.json", 'w') as f: # change path name
        json.dump(data_dict, f)

    return

            



if __name__ == "__main__":
    create_json_data("/Users/yoongtran/Downloads/dev-v2.0.json") # change path name

