from pydantic import BaseModel, EmailStr

class PharmacyCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    admin_name: str
    admin_email: EmailStr
    admin_password: str