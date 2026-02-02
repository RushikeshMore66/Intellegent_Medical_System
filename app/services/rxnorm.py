import requests

RSNORM_BASE="https://rxnav.nlm.nih.gov/REST/rxcui?name="

def normalize_drug_name(drug_name: str):

    """
    convert brand / informal name to standard drug name
    """
    url=f"{RSNORM_BASE}/rxcui.json"
    res=requests.get(url,params=params,timeout=10)

    if res.status_code != 200:
        return drug_name

    ids = res.json().get("idGroup", {}).get("rxnormId", [])
    if not ids:
        return drug_name

    rxcui = ids[0]

    prop_url=f"{RSNORM_BASE}/rxcui/{rxcui}/property.json"
    prop_res=requests.get(prop_url,params=prop_params,timeout=10)

    if prop_res.status_code != 200:
        return drug_name

    props = prop_res.json().get("propConceptGroup", {}).get("propConcept", [])

    return props[0]["propValue"] if props else drug_name
    


    
    