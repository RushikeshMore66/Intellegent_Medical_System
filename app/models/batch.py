from sqlalchemy import Column, String, Float, Integer, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from pydantic import BaseModel
from datetime import date
from app.core.database import Base


class Batch(Base):
    __tablename__ = "batches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    pharmacy_id = Column(UUID(as_uuid=True), ForeignKey("pharmacies.id"), nullable=False)
    medicine_id = Column(UUID(as_uuid=True), ForeignKey("medicines.id"), nullable=False)

    batch_number = Column(String, nullable=False)
    expiry_date = Column(Date, nullable=False)

    quantity = Column(Integer, nullable=False)

    purchase_price = Column(Float, nullable=False)
    selling_price = Column(Float, nullable=False)


