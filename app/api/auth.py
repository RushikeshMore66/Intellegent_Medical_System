from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
import random
from app.api.deps import get_current_user
from app.core.database import SessionLocal
from app.models.pharmacy import Pharmacy
from app.models.users import User
from app.schemas.pharmacy import PharmacyCreate
from app.core.security import hash_password
from pydantic import BaseModel, EmailStr
from app.core.security import verify_password, create_access_token
from app.core.logger import logger
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

router = APIRouter(prefix="/auth", tags=["Authentication"])


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register-pharmacy")
def register_pharmacy(data: PharmacyCreate, db: Session = Depends(get_db)):

    # Check if pharmacy email exists
    existing = db.query(Pharmacy).filter(Pharmacy.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Pharmacy already registered")

    pharmacy_code = f"PHM-{random.randint(10000,99999)}"

    new_pharmacy = Pharmacy(
        name=data.name,
        email=data.email,
        phone=data.phone,
        pharmacy_code=pharmacy_code
    )

    db.add(new_pharmacy)
    db.commit()
    db.refresh(new_pharmacy)

    # Create admin user
    new_user = User(
        pharmacy_id=new_pharmacy.id,
        name=data.admin_name,
        email=data.admin_email,
        password_hash=hash_password(data.admin_password),
        role="admin"
    )

    db.add(new_user)
    db.commit()

    return {
        "message": "Pharmacy registered successfully",
        "pharmacy_code": pharmacy_code
    }

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    logger.info(f"User login attempt: {data.email}")
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        logger.warning(f"Failed login attempt for email {data.email}: User not found")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(data.password, user.password_hash):
        logger.warning(f"Failed login attempt for user {user.id}: Invalid password")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    logger.info(f"User login success: {user.id}")

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "pharmacy_id": str(user.pharmacy_id),
            "role": user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "user_id": str(current_user.id),
        "email": current_user.email,
        "role": current_user.role,
        "pharmacy_id": str(current_user.pharmacy_id)
    }