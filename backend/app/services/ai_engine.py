from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
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

ai_engine = AiEngine()
