from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import random
from uuid import uuid4
from app.models.user import User
from app.models.pharmacy import Pharmacy
from app.api.deps import get_current_user
from app.core.database import SessionLocal
from app.schemas.pharmacy import PharmacyCreate
from app.core.security import hash_password
from app.core.security import verify_password, create_access_token
from app.core.logger import logger
from app.schemas.users import RegistrationRequest, UserResponse
from app.schemas.auth import LoginRequest

router = APIRouter(prefix="/auth", tags=["Authentication"])


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    pharmacy = db.query(Pharmacy).filter(
    Pharmacy.id == pharmacy_id
).first()

    if not pharmacy:
        raise HTTPException(
            status_code=400,
            detail="Pharmacy not found"
        )

    # check existing user
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # create pharmacy
    pharmacy = Pharmacy(
        id=uuid4(),
        name=data.pharmacy_name
    )

    db.add(pharmacy)
    db.commit()
    db.refresh(pharmacy)

    # create user
    new_user = User(
        id=uuid4(),
        pharmacy_id=pharmacy.id,
        name=data.name,
        email=data.email,
        password_hash=get_password_hash(data.password),
        role="admin",
        is_active=True
    )

    db.add(new_user)
    db.commit()

    return {"message": "User registered successfully"}

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