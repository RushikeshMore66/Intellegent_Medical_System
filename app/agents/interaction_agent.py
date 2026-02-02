from typing import List,Dict

ALCOHOL=["alcohol"]

def evaluate_interaction(medicine_name:str,user_query:str)->Dict:
    """
    Check interactions with alcohol and risk level
    """

    interactions=[]
    risk_level="LOW"

    if any(word in user_query.lower() for word in ALCOHOL):
        interactions.append(f"{medicine_name} may increase liver related problem when taken with Alcohol")
        risk_level="HIGH"

    return {
        "interactions":interactions,
        "risk_level":risk_level
    }