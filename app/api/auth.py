from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
import random

from app.core.database import SessionLocal
from app.models.pharmacy import Pharmacy
from app.models.users import User
from app.schemas.pharmacy import PharmacyCreate
from app.core.security import hash_password

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