from app.model.medicine import Medicine
from app.model.knowledge_space import MedicineKnowledgeSpace



def build_knowledge_space(profile:Medicine) -> MedicineKnowledgeSpace:
    Highlights=[]

    if profile.uses:
        Highlights.append("used for" +profile.uses[0])

    if profile.warnings:
        Highlights.append("warning for" +profile.warnings[0])

    safty_summary=(
        "High risk read warning carefully "
    if profile.risk_level=="High"
    else "used as generally directed")

    can_ask=[
        "What are common side effects?",
        "Are there interactions I should know about?",
        "Who should avoid this medicine?"
    ]

    return MedicineKnowledgeSpace(
        Medicine=profile,
        highlights=Highlights,
        safety_summary=safty_summary,
        can_ask=can_ask
    )
    