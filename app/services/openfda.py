import requests

OPENFDA_URL="https://api.fda.gov/drug/label.json"

def fetch_drug_name(drug_name:str):
    params={
        "search":f"drug_name:{drug_name}",
        "limit":1
    }
    res=requests.get(OPENFDA_URL,params=params,timeout=10)
    if res.status_code != 200:
        return None
    results= res.json().get("results",[])
    return results[0] if results else None
