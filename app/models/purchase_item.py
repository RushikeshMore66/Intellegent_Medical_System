from sqlalchemy import String, Date
from sqlalchemy import Column, Float, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.core.database import Base


class PurchaseItem(Base):
    __tablename__ = "purchase_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    purchase_id = Column(UUID(as_uuid=True), ForeignKey("purchases.id"), nullable=False)
    medicine_id = Column(UUID(as_uuid=True), ForeignKey("medicines.id"), nullable=False)

    batch_number = Column(String, nullable=False)
    expiry_date = Column(Date, nullable=False)

    quantity = Column(Integer, nullable=False)
    purchase_price = Column(Float, nullable=False)
    selling_price = Column(Float, nullable=False)