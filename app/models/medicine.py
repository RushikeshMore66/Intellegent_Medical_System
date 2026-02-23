from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.db.base import Base

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    generic_name = Column(String)
    brand_name = Column(String)
    drug_class = Column(String)
    rxnorm_id = Column(String)
    risk_level = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
