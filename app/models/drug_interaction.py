from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, UniqueConstraint
from datetime import datetime
from app.db.base import Base

class DrugInteraction(Base):
    __tablename__ = "drug_interactions"

    id = Column(Integer, primary_key=True, index=True)
    
    drug1_id = Column(Integer, ForeignKey("medicines.id"), nullable=False)
    drug2_id = Column(Integer, ForeignKey("medicines.id"), nullable=False)
    
    severity = Column(String, nullable=False)
    
    mechanism = Column(Text)
    clinical_effect = Column(Text)
    recommendation = Column(Text)
    
    evidence_source = Column(String(255))
    evidence_level = Column(String(50))
    
    last_updated = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint('drug1_id', 'drug2_id', name='unique_drug_pair'),
    )