import requests

RXNORM_BASE = "https://rxnav.nlm.nih.gov/REST"

def normalize_drug_name(drug_name: str):
    """
    Convert brand/informal name to standard drug name using RxNorm API
    """
    # 1. Get RXCUI from name
    url = f"{RXNORM_BASE}/rxcui.json"
    params = {"name": drug_name}
    
    try:
        res = requests.get(url, params=params, timeout=10)
        res.raise_for_status()
    except Exception:
        return drug_name

    data = res.json()
    ids = data.get("idGroup", {}).get("rxnormId", [])
    if not ids:
        return drug_name

    rxcui = ids[0]

    # 2. Get preferred name (property) for that RXCUI
    prop_url = f"{RXNORM_BASE}/rxcui/{rxcui}/property.json"
    prop_params = {"propName": "conceptName"}
    
    try:
        prop_res = requests.get(prop_url, params=prop_params, timeout=10)
        prop_res.raise_for_status()
    except Exception:
        return drug_name

    prop_data = prop_res.json()
    props = prop_data.get("propConceptGroup", {}).get("propConcept", [])
    
    for prop in props:
        if prop.get("propName") == "conceptName":
            return prop.get("propValue", drug_name)

    return drug_name