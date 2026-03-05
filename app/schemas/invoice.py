from typing import List
from datetime import datetime
import uuid
from pydantic import BaseModel, Field

class InvoiceItemCreate(BaseModel):

    medicine_id: str
    batch_id: str
    quantity: int = Field(..., gt=0)


class InvoiceCreate(BaseModel):
    items: List[InvoiceItemCreate]


class InvoiceResponse(BaseModel):
    id: uuid.UUID
    total_amount: float
    gst_amount: float
    created_at: datetime

    class Config:
        from_attributes = True

class InvoiceItemResponse(BaseModel):
    id: uuid.UUID
    medicine_id: uuid.UUID
    quantity: int
    price: float
    purchase_price: float
    gst_percentage: float

    class Config:
        from_attributes = True

class InvoiceDetailResponse(BaseModel):
    id: uuid.UUID
    total_amount: float
    gst_amount: float
    created_at: datetime
    items: List[InvoiceItemResponse]

    class Config:
        from_attributes = True