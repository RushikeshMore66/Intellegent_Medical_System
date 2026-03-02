from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.db.base import Base
from sqlalchemy import Column, String, Float, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.core.database import Base

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pharmacy_id = Column(UUID(as_uuid=True), ForeignKey("pharmacies.id"), nullable=False)

    name = Column(String, nullable=False)
    generic_name = Column(String)
    category = Column(String)
    manufacturer = Column(String)

    hsn_code = Column(String)
    gst_percentage = Column(Float)

    mrp = Column(Float)
    selling_price = Column(Float)

    is_active = Column(Boolean, default=True)