from fastapi import WebSocket,WebSocketDisconnect,FastAPI,Depends
# from fastapi import FastAPI
import google.generativeai as genai
from pydantic import BaseModel
from database import engine
import models
from sqlalchemy.orm import Session
from typing import Annotated,List
from database import get_db
from database import SessionLocal
import uvicorn
from datetime import datetime

app = FastAPI(title='webSocketsex')
#Database requirements
models.Base.metadata.create_all(bind=engine)

class QuestionBase(BaseModel):
    question:str
    communication:int
    correctness:int
    correct:bool
    question_status:bool
    interview_id:int
class InterviewBase(BaseModel):
    technology:str
    experience:int
    important_points:str
    startTime:datetime
    endTime:datetime
    interview_status:bool
    # questions:List[QuestionBase]



#crete anotation 
#It was giving error as   db.add(db_interview)
# TypeError: Session.add() missing 1 required positional argument: 'instance'
db_dependency=Annotated[Session,Depends(get_db)]
# db_dependency=get_db()

class ConnectionMenager:
    def __init__(self) :
        self.active_connections:list[Tuple[WebSocket, dict]] =[]

    async def connect (self,websocket:WebSocket):
        await websocket.accept()
        genai.configure(api_key="AIzaSyBz3Gn7-4bJQcystxOHsxtubbX6A0YEMs8")
        model = genai.GenerativeModel("gemini-1.5-pro-latest")
        self.active_connections.append((websocket,model))

    def disconnect(self,websocket:WebSocket):
        connections=[]
        for connection in self.active_connections:
            if(connection[0]==websocket):
                connections=connection
        self.active_connections.remove(connections)

    async def send_personal_messsage(self,message:str,websocket:WebSocket):
        connections=[]
        for connection in self.active_connections:
            if(connection[0]==websocket):
                connections=connection
        content=connection[1].generate_content(
            message,
            generation_config=genai.GenerationConfig(
            response_mime_type="application/json"
                ),)
        print(content.candidates[0].content.parts[0].text)
        message="question:"+message+"\n answer:"+content.candidates[0].content.parts[0].text
        await connections[0].send_text(message)

    async def broadcast(self,message:str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionMenager()

@app.post("/interview/")
async def create_questions(interview:InterviewBase,db=db_dependency):
    db_interview=models.Interview(
        end_time=None,
        technology=interview.technology,
        start_time=None,
        experience=interview.experience,
        important_points=interview.important_points,
        interview_status=False
    )
    # print(db_interview.technology)
    # print(db_interview.technology)
    # interview = db.query(models.Interview)
    db=SessionLocal()
    db.add(db_interview)
    # db.add(instance=db_interview)
    db.commit()
    db.refresh(db_interview)
    question=QuestionBase(question="what is java?",
    communication=90,
    correctness=90,
    correct=True,
    question_status=True,
    interview_id=0)
    db_question=models.Questions(
        question=question.question,
        communication=question.communication,
        correctness=question.correctness,
        correct=question.correct,
        question_status=question.question_status,
        interviewId=db_interview.id
    )
    db.add(db_question)
    # db.add(instance=db_interview)
    db.commit()
    # print(db_interview)


@app.get("/")
async def get():
    db_interview=models.Interview(
        # endTime=interview.endTime,
        technology="java"
        # experience=interview.experience,
        # important_points=interview.important_points,
        # interview_status=interview.interview_status
    )
    print(get_db())
    # get_db().add()
    

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket:WebSocket,client_id:int):
    await manager.connect(websocket)
    try:
        while True:
            data= await websocket.receive_text()
            await manager.send_personal_messsage(f"You wrote: {data}",websocket)
            # In our case we dont't need to podcast the messages
            # await manager.broadcast(f"client #{client_id} says:{data}" )
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Client #{client_id} hs left the chat")


