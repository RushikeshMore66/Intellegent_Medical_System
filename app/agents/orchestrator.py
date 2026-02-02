
from app.agents.nlp_agent import analyze_query
from app.agents.medicine_agent import build_medicine_profile


def run_orchestrator(user_query:str):

    """
    central brain : decide to run which agent call
    
    """
    nlp_result=analyze_query(user_query)

    if nlp_result["type"] == "MEDICINE":
        profile=build_medicine_profile(nlp_result)
        return {
            "mode":"MEDICINE_OVERVIEW",
            "medicine":profile
        } 

    return {
        "mode": "UNSUPPORTED",
        "message": "This backend currently supports medicine intelligence only."
    }
    
    