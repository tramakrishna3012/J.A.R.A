import os

class AiEngine:
    def __init__(self):
        self.model_name = "distilgpt2"
        self.generator = None
        self.tokenizer = None
        # Lazy loading to avoid startup slowness
    
    def _load_model(self):
        if not self.generator:
            print("Loading AI Model (this may take a moment)...")
            try:
                from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
                self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
                self.model = AutoModelForCausalLM.from_pretrained(self.model_name)
                self.generator = pipeline('text-generation', model=self.model, tokenizer=self.tokenizer)
            except Exception as e:
                print(f"Failed to load AI model: {e}")
                self.generator = None

    def improve_bullet_point(self, text: str) -> str:
        """
        Rewrites a resume bullet point to be more professional.
        Uses Rule-based fallback if AI fails or is too slow.
        """
        # Rule-based enhancements (Faster & Reliable for free tier)
        if not text:
            return ""

        improved = text
        action_verbs = ["Spearheaded", "Orchestrated", "Designed", "Executed", "Optimized"]
        
        # Simple heuristic: If it doesn't start with an action verb, try to suggest one.
        # But for now, let's try the LLM if loaded, else basic string manip
        
        try:
             # self._load_model() # Uncomment if we have enough RAM
             # For 512MB RAM free tier, stick to rules or external API
             pass 
        except:
             pass

        # "Smart" Rule-based Rewrite
        if "responsible for" in improved.lower():
            improved = improved.replace("Responsible for", "Orchestrated the")
        if "helped" in improved.lower():
            improved = improved.replace("Helped", "Collaborated on")
        
        return f"{improved} (Action-Oriented)"

    def extract_job_info(self, text: str) -> dict:
        """
        Extracts Company, Role, and Requirements from raw text (stub).
        """
        return {
            "company": "Detected Company",
            "role": "Detected Role",
            "requirements": ["Python", "React"]
        }

    def map_resume_to_fields(self, form_structure: list, resume_json: dict) -> dict:
        """
        Maps form fields to resume data using heuristics.
        Returns a dict of {selector: value}.
        """
        mapping = {}
        
        # Flatten basic resume info for easier lookup
        basics = resume_json.get("basics", {})
        flat_data = {
            "name": basics.get("name", ""),
            "full name": basics.get("name", ""),
            "first name": basics.get("name", "").split(" ")[0] if basics.get("name") else "",
            "last name": basics.get("name", "").split(" ")[-1] if basics.get("name") else "",
            "email": basics.get("email", ""),
            "phone": basics.get("phone", ""),
            "linkedin": basics.get("url", ""),
            "website": basics.get("url", ""),
            "portfolio": basics.get("url", ""),
            "city": basics.get("location", {}).get("city", ""),
            "cover letter": f"I am excited to apply for this role. I have experience in {', '.join([s['name'] for s in resume_json.get('skills', [])[:3]])}.",
            "summary": basics.get("summary", "")
        }

        for field in form_structure:
            label = field.get("label", "").lower()
            name = field.get("name", "").lower()
            field_id = field.get("id", "").lower()
            
            # Heuristic Matching
            key = f"{label} {name} {field_id}"
            
            value = ""
            if "email" in key:
                value = flat_data["email"]
            elif "phone" in key or "mobile" in key:
                value = flat_data["phone"]
            elif "linkedin" in key:
                value = flat_data["linkedin"]
            elif "website" in key or "portfolio" in key:
                value = flat_data["portfolio"]
            elif "first name" in key:
                value = flat_data["first name"]
            elif "last name" in key:
                value = flat_data["last name"]
            elif "name" in key and "full" in key or "name" == key.strip():
                value = flat_data["name"]
            elif "city" in key or "location" in key:
                value = flat_data["city"]
            elif "cover" in key and "letter" in key:
                value = flat_data["cover letter"]
            
            if value:
                mapping[field["selector"]] = value
                
        return mapping

    def generate_outreach_email(self, hr_context: dict, user_profile: dict) -> str:
        """
        Generates a personalized outreach email for an HR contact.
        Falls back to a high-quality template if the AI model is unavailable.
        """
        hr_name = hr_context.get("hr_name", "")
        hr_first_name = hr_name.split()[0] if hr_name else "Hiring Team"
        company = hr_context.get("company") or "your company"
        role = hr_context.get("role") or "the open position"
        
        skills_list = user_profile.get("skills", [])
        skills = ", ".join([s["name"] for s in skills_list[:3]]) if skills_list else "software engineering"
        
        basics = user_profile.get("basics", {})
        my_name = basics.get("name", "[Your Name]")
        portfolio = basics.get("url", "")
        
        link_text = f" You can also see some of my recent work here: {portfolio}." if portfolio else ""
        
        template = f"""Hi {hr_first_name},

I hope this email finds you well.

I came across the {role} opportunity at {company} and wanted to reach out directly. With my background in {skills}, I believe I could bring immediate value to your team.

I have attached my resume for your review.{link_text}

Would you be open to a brief chat to discuss how my experience aligns with the {role} position?

Best regards,
{my_name}"""

        # In a full-scale deployment with OpenAI/Claude APIs or sufficient local RAM, 
        # we would pass variables to an LLM here for more variance and tone matching.
        # For reliability and speed in low-resource environments, the template is returned.
        return template

ai_engine = AiEngine()
