from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.orchestrator import run_orchestrator
from app.agents.medicine_agent import build_medicine_profile
from app.agents.interaction_agent import evaluate_interaction
from app.agents.answer_agent import compose_answer



router = APIRouter()

class QueryRequest(BaseModel):
    input: str

@router.post("/analyze")
def analyze_query(req: QueryRequest):
    """
    main intellgence endpoint
    """
    return run_orchestrator(req.input)

class ScopedQuetions(BaseModel):
    medicine_name:str
    questions:str

@router.post("/medicine/ask")
def ask_about_medicine(req:ScopedQuetions):
    """
    ask specific questions about a medicine
    """
    nlp_result={"raw_text":req.questions,"type":"MEDICINE"}
    profile=build_medicine_profile(nlp_result)
    interaction_result=evaluate_interaction(profile.name or profile.generic_name,req.questions)
    profile.interactions=interaction_result["interactions"]
    profile.risk_level=interaction_result["risk_level"]

    answer=compose_answer(profile,req.questions)
    return {
        "answer": answer,
        "medicine":profile.name
    }
