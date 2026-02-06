from pydantic import BaseModel
from typing import List
from app.model.medicine import Medicine

def MedicineKnowledgeSpace(BaseModel):
    medicine:Medicine
    highlights: List[str]          
    safety_summary: str            
    can_ask: List[str]
    