from sqlalchemy import Column, Integer, String,TIMESTAMP,Boolean,ForeignKey,Text
from database import Base

class Interview(Base):
    __tablename__="interviews"

    id=Column(Integer,primary_key=True,index=True)
    start_time=Column(TIMESTAMP(timezone=True),index=True)
    end_time=Column(TIMESTAMP(timezone=True),index=True)
    technology=Column(String,index=True)
    experience=Column(Integer,nullable=False,index=True)
    important_points=Column(Text,index=True)
    interview_status=Column(Boolean,default=False,nullable=False,index=True)

class Questions(Base):
    __tablename__="questions"
    id=Column(Integer,primary_key=True,index=True)
    interviewId=Column(Integer,ForeignKey("interviews.id"),index=True)
    question=Column(Text,index=True)
    communication=Column(Integer,index=True)
    correctness=Column(Integer,index=True)
    correct=Column(Boolean,default=False,index=True)
    question_status=Column(Boolean,default=False,index=True)
