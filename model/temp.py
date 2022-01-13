import typer

app = typer.Typer()

def add_five(inp):
    return 5+inp

@app.command()
def print_arg(some_input):
    print(some_input)
    print(type(some_input))
    print(add_five(int(some_input)))
    

if __name__ == "__main__":
    app()

# class Dog:

#     def __init__(self, name):
#         self.name = name
#         self.tricks = "bark"

#     def change_trick(self, new_trick):
#         self.tricks = new_trick

# d = Dog('Fido')
# print("d's tricks:", d.tricks)
# d.change_trick("roll")
# print("d's tricks:", d.tricks)

# e = Dog("Buddy")
# print("e's tricks:", e.tricks)