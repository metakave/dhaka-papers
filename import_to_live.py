
import json
import requests
import os

# Configuration for LIVE server
API_URL = "https://beta.dhakapapers.com/api/v1"
ADMIN_EMAIL = "admin@newsportal.com"
ADMIN_PASSWORD = "password321123" 
DATA_PATH = "/Users/musfiqurtuhin/Downloads/Extrajudicial Killing/victims.json"
R2_BASE_URL = "https://pub-a6f30b17c688489f85618f1bdd18fc81.r2.dev"

def get_token():
    print(f"Logging in to LIVE server ({API_URL})...")
    res = requests.post(f"{API_URL}/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    res.raise_for_status()
    return res.json()["token"]

def import_data():
    try:
        token = get_token()
    except Exception as e:
        print(f"Login failed: {e}")
        return

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # 1. Create the Special Report
    print("Creating/Updating Special Report on LIVE...")
    report_data = {
        "title": "Extrajudicial Killing: A Solitary Cry for Justice",
        "slug": "extrajudicial-killing",
        "description": "A solemn investigative infographic story documenting the victims of extrajudicial killings and the solitary cry for justice from their families.",
        "status": "published"
    }
    
    res = requests.post(f"{API_URL}/special-reports", json=report_data, headers=headers)
    if res.status_code != 201:
        print(f"Report might already exist, fetching existing ID...")
        res = requests.get(f"{API_URL}/special-reports/extrajudicial-killing")
        report_id = res.json()["id"]
    else:
        report_id = res.json()["id"]
    
    print(f"Report ID: {report_id}")

    # 2. Parse victims.json and upload items
    print("Reading victims data...")
    with open(DATA_PATH, 'r') as f:
        victims = json.load(f)

    report_items = []
    for v in victims:
        photo_num = v.get("photo_num")
        qr_num = v.get("qr_num")
        
        image_url = f"{R2_BASE_URL}/special-reports/extrajudicial-killing/images/image{photo_num}.jpg" if photo_num else ""
        qr_url = f"{R2_BASE_URL}/special-reports/extrajudicial-killing/qrcodes/image{qr_num}.png" if qr_num else ""
        
        item = {
            "title": v["name"],
            "date_str": v["date"],
            "details": v["details"],
            "image_url": image_url,
            "qr_code_url": qr_url,
            "news_url": v["news_url"],
            "serial_number": int(v["id"])
        }
        report_items.append(item)

    print(f"Syncing {len(report_items)} items to report {report_id}...")
    res = requests.post(f"{API_URL}/special-reports/{report_id}/items", json=report_items, headers=headers)
    res.raise_for_status()
    print("Import to LIVE complete!")

if __name__ == "__main__":
    import_data()
