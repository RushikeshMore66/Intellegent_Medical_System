from sqlalchemy import Column, Float, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.core.database import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    pharmacy_id = Column(UUID(as_uuid=True), ForeignKey("pharmacies.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    total_amount = Column(Float, nullable=False)
    gst_amount = Column(Float, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())