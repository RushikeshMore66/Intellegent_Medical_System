from pydantic import BaseModel
from typing import Optional


class MedicineCreate(BaseModel):
    name: str
    generic_name: Optional[str]
    category: Optional[str]
    manufacturer: Optional[str]
    hsn_code: Optional[str]
    gst_percentage: float
    mrp: float
    selling_price: float


class MedicineResponse(BaseModel):
    id: str
    name: str
    generic_name: Optional[str]
    category: Optional[str]
    manufacturer: Optional[str]
    gst_percentage: float
    mrp: float
    selling_price: float

    class Config:
        from_attributes = True