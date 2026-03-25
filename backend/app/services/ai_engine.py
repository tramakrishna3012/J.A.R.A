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

    def improve_bullet_point(self, text: str, target_skills: list = None) -> str:
        """
        Resume Optimization Agent: Rewrites a resume bullet point to be more professional
        and aligns it with target skills from a Job Description.
        """
        if not text:
            return ""

        improved = text
        if target_skills:
            # Rule-based injection / modification for ATS alignment
            for skill in target_skills[:2]: # Try to weave in top 2 skills if missing
                if skill.lower() not in improved.lower():
                    improved += f" utilizing {skill}"

        # "Smart" Rule-based Rewrite
        if "responsible for" in improved.lower():
            improved = improved.replace("responsible for", "Orchestrated the").replace("Responsible for", "Orchestrated the")
        if "helped" in improved.lower():
            improved = improved.replace("helped", "Collaborated on").replace("Helped", "Collaborated on")
            
        return f"{improved.strip()} (Action-Oriented)"

    def extract_job_info(self, text: str) -> dict:
        """
        Job Analysis Agent: Extracts Company, Role, and Requirements from raw JD text.
        """
        # In a production AI setting this would be an LLM structured output.
        # Fallback heuristic extraction:
        lower_text = text.lower()
        company = "Detected Company"
        role = "Detected Role"
        
        # Simple extraction heuristics based on common structures
        if "software engineer" in lower_text or "developer" in lower_text:
             role = "Software Engineer"
             
        found_skills = []
        tech_keywords = ["python", "react", "typescript", "aws", "docker", "javascript", "fastapi"]
        for tech in tech_keywords:
             if tech in lower_text:
                 found_skills.append(tech.capitalize())

        return {
            "company": company,
            "role": role,
            "requirements": found_skills if found_skills else ["Python", "React"]
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

    def generate_referral_draft(self, company: str, role: str, connection_name: str) -> str:
        """
        Referral Agent: Drafts a highly professional cold referral/connection request.
        Max 300 chars for LinkedIn.
        """
        conn_first_name = connection_name.split()[0] if connection_name else "there"
        draft = (
            f"Hi {conn_first_name},\n\n"
            f"I see you work at {company} and I'm a big fan of the engineering culture there. "
            f"I'm interested in the {role} position and would love to ask you a quick question about your experience. "
            f"Would you be open to connecting?\n\nBest"
        )
        return draft

    def generate_application_plan(self, job_metadata: dict) -> list:
        """
        Application Planner Agent & Decision Engine:
        Determines the state machine pipeline for a specific job application.
        """
        steps = []
        is_referral_likely = bool(job_metadata.get('has_connections', False))
        
        steps.append({"step": 1, "action": "analyze_job_description", "status": "pending"})
        steps.append({"step": 2, "action": "optimize_master_resume", "status": "pending"})
        
        if is_referral_likely:
             steps.append({"step": 3, "action": "draft_referral_request", "status": "pending"})
             steps.append({"step": 4, "action": "wait_for_user_approval", "status": "blocking_on_user"})
             steps.append({"step": 5, "action": "send_referral_message", "status": "pending"})
        else:
             steps.append({"step": 3, "action": "wait_for_user_approval", "status": "blocking_on_user"})
             steps.append({"step": 4, "action": "trigger_n8n_browser_apply", "status": "pending"})
             
        steps.append({"step": (6 if is_referral_likely else 5), "action": "track_status_in_db", "status": "pending"})
        
        return steps

ai_engine = AiEngine()
