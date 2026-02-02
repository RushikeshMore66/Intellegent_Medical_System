from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.orchestrator import run_orchestrator

router = APIRouter()

class QueryRequest(BaseModel):
    input: str

@router.post("/analyze")
def analyze_query(req: QueryRequest):
    """
    main intellgence endpoint
    """
    return run_orchestrator(req.input)
