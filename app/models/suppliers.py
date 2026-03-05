from sqlalchemy import Column, String, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.core.database import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pharmacy_id = Column(UUID(as_uuid=True), ForeignKey("pharmacies.id"), nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    phone = Column(String)
    email = Column(String)
    gst_number = Column(String)
    address = Column(String)
    is_active = Column(Boolean, default=True, nullable=False, index=True)