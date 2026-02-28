from fastapi import FastAPI
from app.core.database import engine, Base
from app.models.pharmacy import Pharmacy
from app.models.users import User
from app.api.auth import router as auth_router

app = FastAPI()

app.include_router(auth_router)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "PharmaOS Backend Running"}
