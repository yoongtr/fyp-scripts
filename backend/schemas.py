import datetime as dt
import pydantic as pydantic

class _UserBase(pydantic.BaseModel):
    email: str
    first_name: str
    last_name: str
    practice_count: int
    ranking: str

class UserCreate(_UserBase):
    hashed_password: str

    class Config:
        orm_mode = True

class User(_UserBase):
    id: int

    class Config:
        orm_mode = True

class _QuizBase(pydantic.BaseModel):
    quiz_context: str
    quiz_qns: str
    quiz_ans: str

class QuizCreate(_QuizBase):
    pass

class Quiz(_QuizBase):
    id: int
    user_id: int
    quiz_date: dt.datetime

    class Config:
        orm_mode = True

class _ContextBase(pydantic.BaseModel):
    pass

class ContextCreate(_ContextBase):
    pass

class Context(_ContextBase):
    id: int
    quiz_id: int
    context_text: str

    class Config:
        orm_mode = True

class _QnABase(pydantic.BaseModel):
    pass

class QnACreate(_QnABase):
    pass

class QnA(_QnABase):
    context_id: int
    question_text: str
    answer_text: str
    rating: int

    class Config:
        orm_mode = True

class Candidate(pydantic.BaseModel):
    input_passage: str