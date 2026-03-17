from fastapi.testclient import TestClient
from app.main import app
import os
import json

client = TestClient(app)

def main():
    print("--- Testing Automation API ---")
    
    file_path = os.path.abspath("test_form.html")
    url = f"file:///{file_path}"
    
    # Mock Resume Data (in a real scenario, this would come from DB or request)
    resume_data = {
        "basics": {
            "name": "Pepper Potts",
            "email": "ceo@stark.com",
            "phone": "987-654-3210",
            "url": "https://linkedin.com/in/pepper",
            "location": {"city": "New York"},
            "summary": "Managing Stark Industries."
        },
        "skills": [{"name": "Management"}, {"name": "Logistics"}]
    }

    print(f"\n1. Requesting PLAN for {url}...")
    plan_response = client.post("/api/v1/automation/plan", json={
        "job_url": url,
        "resume_data": resume_data
    })
    
    if plan_response.status_code != 200:
        print(f"FAILED: {plan_response.text}")
        return

    plan_data = plan_response.json()
    print("Plan Status:", plan_data["status"])
    print("Proposed Mapping:", json.dumps(plan_data["proposed_mapping"], indent=2))
    
    mapping = plan_data["proposed_mapping"]
    
    # Verify Mapping
    assert mapping["#full_name"] == "Pepper Potts"
    assert mapping["#email"] == "ceo@stark.com"
    
    print("\n2. Executing APPLICATION...")
    exec_response = client.post("/api/v1/automation/execute", json={
        "job_url": url,
        "mapping": mapping
    })
    
    if exec_response.status_code != 200:
        print(f"FAILED: {exec_response.text}")
        return
        
    exec_data = exec_response.json()
    print("Execution Result:", json.dumps(exec_data, indent=2))
    
    assert exec_data["status"] == "success"
    print("\nSUCCESS: API Workflow Verified.")

if __name__ == "__main__":
    main()
