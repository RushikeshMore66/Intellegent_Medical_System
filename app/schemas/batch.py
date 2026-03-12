from pydantic import BaseModel, Field
from datetime import date

class BatchCreate(BaseModel):

    medicine_id: str
    batch_number: str = Field(..., min_length=1)
    expiry_date: date
    quantity: int = Field(..., gt=0)
    purchase_price: float = Field(..., gt=0)
    selling_price: float = Field(..., gt=0)


from uuid import UUID

class BatchResponse(BaseModel):
    id: UUID
    medicine_id: UUID
    batch_number: str
    expiry_date: date
    quantity: int
    purchase_price: float
    selling_price: float

class Config:
    from_attributes = True