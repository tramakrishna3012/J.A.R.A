try:
    from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
    import torch
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    print("Transformers not available. Falling back to rules.")

import random
import re

class AIEngine:
    def __init__(self):
        self.model_name = "distilgpt2" # Very small model (simulating low resources)
        self.generator = None
        
        if TRANSFORMERS_AVAILABLE:
            try:
                # Lazy load: We don't load immediately to save startup time
                print("AI Engine initialized. Model will load on first request.")
            except Exception as e:
                print(f"Failed to init AI: {e}")

    def _load_model(self):
        if not self.generator and TRANSFORMERS_AVAILABLE:
            print(f"Loading {self.model_name}...")
            tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            model = AutoModelForCausalLM.from_pretrained(self.model_name)
            self.generator = pipeline("text-generation", model=model, tokenizer=tokenizer)

    def improve_bullet_point(self, text: str) -> str:
        """
        Improves a resume bullet point using LLM or Rules.
        """
        text = text.strip()
        if not text:
            return ""

        # 1. Try LLM (if short enough to likely be a raw bullet)
        if TRANSFORMERS_AVAILABLE:
            try:
                self._load_model()
                if self.generator:
                    prompt = f"Rewrite this resume bullet to be professional and action-oriented:\nOriginal: {text}\nImproved:"
                    
                    output = self.generator(
                        prompt, 
                        max_new_tokens=30, 
                        num_return_sequences=1, 
                        temperature=0.7,
                        truncation=True
                    )
                    
                    generated = output[0]['generated_text']
                    # Extract the "Improved:" part
                    if "Improved:" in generated:
                        result = generated.split("Improved:")[-1].strip()
                        return result.split("\n")[0] # user first line
            except Exception as e:
                print(f"LLM Generation failed: {e}")
                
        # 2. Fallback to Rule-Based
        return self._rule_based_improve(text)

    def _rule_based_improve(self, text: str) -> str:
        """
        Rule-based heuristics for low-resource environments.
        """
        action_verbs = ["Spearheaded", "Orchestrated", "Developed", "Optimized", "Engineered"]
        
        if text.lower().startswith("i "):
            text = text[2:].strip()
            
        if len(text.split()) < 10:
            verb = random.choice(action_verbs)
            return f"{verb} {text[0].lower() + text[1:]} resulting in improved efficiency."
            
        return text

    def analyze_job_match(self, resume_text: str, job_desc: str) -> dict:
        """
        Calculates simple keyword overlap match score.
        """
        resume_words = set(re.findall(r'\w+', resume_text.lower()))
        job_words = set(re.findall(r'\w+', job_desc.lower()))
        
        common = resume_words.intersection(job_words)
        score = len(common) / len(job_words) if job_words else 0
        
        return {
            "match_score": round(score * 100, 1),
            "missing_keywords": list(job_words - resume_words)[:5]
        }

ai_engine = AIEngine()
