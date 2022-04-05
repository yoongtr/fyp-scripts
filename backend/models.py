import datetime as dt
from tkinter.tix import COLUMN
from turtle import back
import sqlalchemy as sql
import sqlalchemy.orm as orm
import passlib.hash as hash
import database as database


class User(database.Base):
    __tablename__ = "users"
    id = sql.Column(sql.Integer, primary_key=True, index=True)
    email = sql.Column(sql.String, unique=True, index=True)
    hashed_password = sql.Column(sql.String)
    first_name = sql.Column(sql.String)
    last_name = sql.Column(sql.String)
    practice_count = sql.Column(sql.Integer)
    ranking = sql.Column(sql.String)

    quizzes = orm.relationship("Quiz", back_populates="user")
    qnas = orm.relationship("QnA", back_populates="user")
    # leads = orm.relationship("Lead", back_populates="owner")

    def verify_password(self, password: str):
        return hash.bcrypt.verify(password, self.hashed_password)

class Quiz(database.Base):
    __tablename__ = "quizzes"
    id = sql.Column(sql.Integer, primary_key=True, index=True)
    user_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"))
    quiz_date = sql.Column(sql.DateTime, default=dt.datetime.utcnow)
    quiz_context = sql.Column(sql.String)
    quiz_qns = sql.Column(sql.String)
    quiz_ans = sql.Column(sql.String)

    user = orm.relationship("User", back_populates="quizzes")
    contexts = orm.relationship("Context", back_populates="quiz")

class Context(database.Base):
    __tablename__ = "contexts"
    id = sql.Column(sql.Integer, primary_key=True, index=True)
    quiz_id = sql.Column(sql.Integer, sql.ForeignKey("quizzes.id"))
    context_text = sql.Column(sql.String)

    quiz = orm.relationship("Quiz", back_populates="contexts")
    qnas = orm.relationship("QnA", back_populates="context")

class QnA(database.Base):
    __tablename__ = "qnas"
    id = sql.Column(sql.Integer, primary_key=True, index=True)
    context_id = sql.Column(sql.Integer, sql.ForeignKey("contexts.id"))
    user_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"))
    question_text = sql.Column(sql.String)
    answer_text = sql.Column(sql.String)
    rating = sql.Column(sql.Integer)

    context = orm.relationship("Context", back_populates="qnas")
    user = orm.relationship("User", back_populates="qnas")
