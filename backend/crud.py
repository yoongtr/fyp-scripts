import sqlalchemy.orm as orm
import passlib.hash as hash
import database as database, models as models, schemas as schemas
import jwt as jwt
import fastapi as fastapi
import fastapi.security as security
import datetime as dt

oauth2schema = security.OAuth2PasswordBearer(tokenUrl="/api/token")
JWT_SECRET = "yoongsecret"

def create_database():
    return database.Base.metadata.create_all(bind=database.engine)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_user_by_email(email: str, db: orm.Session):
    return db.query(models.User).filter(models.User.email == email).first()

async def get_users(user: schemas.User, db: orm.Session, skip: int = 0, limit: int = 30):
    users = db.query(models.User).order_by(models.User.practice_count.desc()).offset(skip).limit(limit).all()
    return list(map(schemas.User.from_orm, users))

async def create_user(user: schemas.UserCreate, db: orm.Session):
    user_obj = models.User(
        email=user.email, 
        hashed_password=hash.bcrypt.hash(user.hashed_password), 
        first_name=user.first_name, 
        last_name=user.last_name,
        practice_count=user.practice_count,
        ranking=user.ranking)
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj

async def authenticate_user(email: str, password: str, db: orm.Session):
    user = await get_user_by_email(db=db, email=email)
    if not user:
        return False
    if not user.verify_password(password):
        return False
    return user

async def create_token(user: models.User):
    user_obj = schemas.User.from_orm(user)
    token = jwt.encode(user_obj.dict(), JWT_SECRET)
    return dict(access_token=token, token_type="bearer")

async def get_current_user(
    db: orm.Session = fastapi.Depends(get_db),
    token: str = fastapi.Depends(oauth2schema),
):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(models.User).get(payload["id"])
    except:
        raise fastapi.HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )
    return schemas.User.from_orm(user)

async def _user_selector(user_id: int, user: schemas.User, db: orm.Session):
    user = (
        db.query(models.User)
        .filter(models.User.id==user_id)
        .first()
    )
    if user is None:
        raise fastapi.HTTPException(status_code=404, detail="User does not exist")
    return user

async def delete_user(user_id: int, user: schemas.User, db: orm.Session):
    user = await _user_selector(user_id, user, db)
    db.delete(user)
    db.commit()

async def update_user(user_id: int, user_updated: schemas.UserCreate, user: schemas.User, db: orm.Session):
    user = await _user_selector(user_id, user, db)

    user.first_name = user_updated.first_name
    user.last_name = user_updated.last_name

    db.commit()
    db.refresh(user)

    return schemas.User.from_orm(user)

async def update_rank(user_id: int, user: schemas.User, db: orm.Session):
    user = await _user_selector(user_id, user, db)

    # user.practice_count = user_updated.practice_count
    curr_count = user.practice_count
    curr_count = curr_count + 1

    if curr_count < 3:
        new_rank = "Noob"
    elif 3 <= curr_count and curr_count <=5:
        new_rank = "Apprentice"
    elif 5 < curr_count and curr_count <=10:
        new_rank = "Expert"
    else:
        new_rank = "Master"
    user.practice_count = curr_count
    user.ranking = new_rank

    db.commit()
    db.refresh(user)

    return schemas.User.from_orm(user)

async def create_quiz(quiz: schemas.QuizCreate, user: schemas.User, db: orm.Session):
    quiz = models.Quiz(
        # **quiz.dict(),
        user_id=user.id,
        quiz_context=quiz.quiz_context,
        quiz_qns=quiz.quiz_qns,
        quiz_ans=quiz.quiz_ans
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    return schemas.Quiz.from_orm(quiz)

async def get_quizzes(user: schemas.User, db: orm.Session, skip: int = 0, limit: int = 30):
    quizzes = db.query(models.Quiz).order_by(models.Quiz.quiz_date.desc()).offset(skip).limit(limit).all()
    return list(map(schemas.Quiz.from_orm, quizzes))

async def get_my_quizzes(user: schemas.User, db: orm.Session, skip: int = 0, limit: int = 30):
    quizzes = db.query(models.Quiz).filter(models.Quiz.user_id==user.id).order_by(models.Quiz.quiz_date.desc()).offset(skip).limit(limit).all()
    return list(map(schemas.Quiz.from_orm, quizzes))