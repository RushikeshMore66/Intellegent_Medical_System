from pydantic import BaseModel
from typing import Optional,List

class Medicine(BaseModel):
    name: str
    generic_name: Optional[str] = None
    overview: Optional[str] = None
    
    usage:list[str] = []
    dosage_summary:list[str] = []
    side_effects:list[str]=[]
    warnings:list[str]=[]
    interactions:list[str]=[]

    evidence_level:Optional[str]=None
    risk_level:Optional[str]=None
    
    
   
    
    