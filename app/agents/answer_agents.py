from app.services.groq_llm import groq_llm
from app.models.medicine import Medicine

SYSTEM_PROMPT="""
You are a medical information assistant.
        
STRICT RULES:
- Use ONLY the provided medicine data.
- Do NOT diagnose conditions.
- Do NOT prescribe treatments.
- Do NOT give personalized dosage advice.
- If information is missing, say so clearly.
- Always include safety warnings when risk is HIGH.
- State that this is not medical advice.


"""
def compose_answer(
    medicine: Medicine,
    user_query: str
) -> str:
    """
    Convert structured medicine profile into a human-readable explanation
    """

    context = f"""
Medicine Name: {medicine.name}
Generic Name: {medicine.generic_name}

Uses:
{medicine.uses}

Warnings:
{medicine.warnings}

Side Effects:
{medicine.side_effects}

Interactions:
{medicine.interactions}

Risk Level: {medicine.risk_level}
Evidence Source: {medicine.evidence_level}
"""

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": f"""
Medical Data:
{context}

User Question:
{user_query}
"""
        }
    ]

    return groq_llm(messages)