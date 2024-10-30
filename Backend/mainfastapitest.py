from fastapi import FastAPI,HTTPException,Depends
from pydantic import BaseModel
from typing import List,Annotated
from database import engine,SessionLocal
import models
from sqlalchemy.orm import Session

app=FastAPI()
models.Base.metadata.create_all(bind=engine)

class InteviewBase(BaseModel):
    technology:str

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency=Annotated[Session,Depends(get_db)]

@app.post("/interview/")
async def create_question(interview:InteviewBase,db=db_dependency):
    db_question=models.Interview(technology=interview.technology)
    db.add(db_question)
    db.commit()
