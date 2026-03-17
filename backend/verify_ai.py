from app.services.ai_engine import ai_engine
import json

def main():
    print("--- Testing AI Resume Mapper ---")
    
    # Mock Resume
    resume = {
        "basics": {
            "name": "Tony Stark",
            "email": "tony@stark.com",
            "phone": "123-456-7890",
            "url": "https://linkedin.com/in/ironman",
            "location": {"city": "Malibu"},
            "summary": "I build cool suits."
        },
        "skills": [{"name": "Physics"}, {"name": "Engineering"}, {"name": "AI"}]
    }

    # Mock Form Structure (similar to what extract_form_structure returns)
    form_structure = [
        {"label": "Full Name", "name": "name", "id": "full_name", "selector": "#full_name"},
        {"label": "Email", "name": "email", "id": "email", "selector": "#email"},
        {"label": "Phone", "name": "phone", "id": "phone", "selector": "#phone"},
        {"label": "LinkedIn Profile", "name": "linkedin", "id": "linkedin", "selector": "#linkedin"},
        {"label": "City", "name": "city", "id": "city", "selector": "#city"},
        {"label": "Why are you a good fit? (Cover Letter)", "name": "cover_letter", "id": "cover", "selector": "#cover"}
    ]

    print(f"Resume: {resume['basics']['name']}")
    print(f"Form Fields: {[f['label'] for f in form_structure]}")

    mapping = ai_engine.map_resume_to_fields(form_structure, resume)
    
    print("\n--- Mapping Result ---")
    print(json.dumps(mapping, indent=2))

    # Verification checks
    assert mapping["#full_name"] == "Tony Stark"
    assert mapping["#email"] == "tony@stark.com"
    assert "Physics" in mapping["#cover"]
    
    print("\nSUCCESS: All critical fields mapped correctly.")

if __name__ == "__main__":
    main()
