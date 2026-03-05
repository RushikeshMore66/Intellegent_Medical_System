from pydantic import BaseModel, Field

class SupplierCreate(BaseModel):

    name: str = Field(..., min_length=2)
    phone: str = Field(..., min_length=10, max_length=15)
    email: str | None = None
    gst_number: str | None = None
    address: str | None = None