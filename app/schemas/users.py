from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str = "pharmacist"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    pharmacy_id: Optional[UUID] = None
    role: str = "pharmacist"

class UserResponse(UserBase):
    id: UUID
    pharmacy_id: UUID
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class RegistrationRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    pharmacy_name: Optional[str] = None
