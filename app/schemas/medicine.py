from pydantic import BaseModel, Field
from typing import Optional

class MedicineCreate(BaseModel):

    name: str = Field(..., min_length=2, max_length=200)
    generic_name: Optional[str] = Field(None, max_length=200)
    category: Optional[str]
    manufacturer: Optional[str]
    gst_percentage: float = Field(..., ge=0, le=28)
    mrp: float = Field(..., gt=0)
    selling_price: float = Field(..., gt=0)


from uuid import UUID

class MedicineResponse(BaseModel):
    id: UUID
    name: str
    generic_name: Optional[str]
    category: Optional[str]
    manufacturer: Optional[str]
    gst_percentage: float
    mrp: float
    selling_price: float

    class Config:
        from_attributes = True