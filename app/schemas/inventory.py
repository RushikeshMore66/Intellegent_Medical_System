from pydantic import BaseModel
from datetime import date


class InventoryCreate(BaseModel):
    medicine_id: str
    batch_number: str
    quantity: int
    purchase_price: float
    selling_price: float
    expiry_date: date


class InventoryResponse(BaseModel):
    id: str
    medicine_id: str
    batch_number: str
    quantity: int
    purchase_price: float
    selling_price: float
    expiry_date: date

    class Config:
        from_attributes = True