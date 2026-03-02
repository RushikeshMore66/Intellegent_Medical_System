from pydantic import BaseModel
from datetime import date


class BatchCreate(BaseModel):
    medicine_id: str
    batch_number: str
    expiry_date: date
    quantity: int
    purchase_price: float
    selling_price: float


class BatchResponse(BaseModel):
    id: str
    medicine_id: str
    batch_number: str
    expiry_date: date
    quantity: int
    purchase_price: float
    selling_price: float

class Config:
    from_attributes = True