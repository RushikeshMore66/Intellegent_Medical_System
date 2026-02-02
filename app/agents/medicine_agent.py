from app.model.medicine import Medicine
from app.services.rxnorm import normalize_drug_name
from app.services.openfda import fetch_drug_name

def build_medicine_profile(nlp_result: dict):
    raw_name = nlp_result["raw_text"]

    generic_name = normalize_drug_name(raw_name)
    label = fetch_drug_name(generic_name)

    if not label:
        return Medicine(
            name=raw_name,
            generic_name=None,
            overview="overview will be populated by agents",
            evidence_level="FDA",
            risk_level="LOW"
        )

    # Extraction and section mapping
    usage = label.get("indication_and_usage", [])
    dosage_summary = label.get("dosage_and_administration", [])
    warnings = label.get("warnings", [])
    side_effects = label.get("adverse_reactions", [])
    
    # Risk heuristic
    risk = "HIGH" if warnings else "LOW"

    return Medicine(
        name=raw_name,
        generic_name=generic_name,
        overview=usage[0] if usage else None,
        usage=usage,
        dosage_summary=dosage_summary,
        warnings=warnings,
        side_effects=side_effects,
        evidence_level="FDA",
        risk_level=risk
    )
    

