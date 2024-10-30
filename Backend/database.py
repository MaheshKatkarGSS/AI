from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

URL_DATABASE="postgresql://postgres:root@localhost:5432/interviewai"
engine=create_engine(URL_DATABASE)
SessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)
Base=declarative_base()
def get_db():
    db=SessionLocal()
    try:
        # db._warn_on_events={}
        yield db
    except KeyboardInterrupt:
        print("Key Borad Interrupt")
    finally:
        db.close()