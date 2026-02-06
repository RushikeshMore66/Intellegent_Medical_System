
from app.agents.nlp_agent import analyze_query
from app.agents.medicine_agent import build_medicine_profile
from app.agents.interaction_agent import evaluate_interaction
from app.agents.knowledge_space_agent import build_knowledge_space

def run_orchestrator(user_query:str):

    """
    central brain : decide to run which agent call
    
    """
    nlp_result=analyze_query(user_query)

    if nlp_result["type"] == "MEDICINE":
        profile=build_medicine_profile(nlp_result)

        interaction_result=evaluate_interaction(profile.name or profile.generic_name,user_query)
        profile.interactions=interaction_result["interactions"]
        profile.risk_level=interaction_result["risk_level"]

        knowledge_space=build_knowledge_space(profile)
        
        return {
            "mode":"MEDICINE_OVERVIEW",
            "answer":knowledge_space
        } 

    return {
        "mode": "UNSUPPORTED",
        "message": "This backend currently supports medicine intelligence only."
    }
    
    