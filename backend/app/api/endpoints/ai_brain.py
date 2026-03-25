from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import time
from app.services.ai_engine import ai_engine

router = APIRouter()

# --- Pydantic Schemas ---

class JobIngestion(BaseModel):
    url: Optional[str] = None
    raw_text: Optional[str] = None

class JobAnalysisResponse(BaseModel):
    role: str
    company: str
    skills: List[str]

class ResumeOptimizationRequest(BaseModel):
    job_id: str
    master_resume_json: Dict[str, Any]

class ReferralGenerationRequest(BaseModel):
    company: str
    role: str
    connection_name: str

class n8nCallback(BaseModel):
    job_id: str
    status: str
    message: Optional[str] = None

class ChatRequest(BaseModel):
    message: str

# --- Mock Background Tasks ---
def process_job_analysis(data: JobIngestion):
    # In a real system, this would trigger the AI Engine, parse the URL,
    # and save the structured JD to Supabase.
    print(f"Background: Analyzing job from {data.url or 'raw_text'}...")
    time.sleep(2)
    print("Background: Analysis complete.")

# --- Endpoints ---

@router.post("/ingest-job")
async def ingest_job(data: JobIngestion, background_tasks: BackgroundTasks):
    """
    Webhook trigger to ingest a new job (from dashboard, extension, or email).
    """
    if not data.url and not data.raw_text:
        raise HTTPException(status_code=400, detail="Must provide url or raw_text")
    
    background_tasks.add_task(process_job_analysis, data)
    return {"status": "ingested", "message": "Job added to queue for AI analysis."}

@router.post("/analyze-job", response_model=JobAnalysisResponse)
async def analyze_job(data: JobIngestion):
    """
    Synchronous endpoint for Job Analysis Agent to extract keywords immediately.
    """
    if not data.raw_text:
        return JobAnalysisResponse(role="Unknown", company="Unknown", skills=[])
        
    extracted_data = ai_engine.extract_job_info(data.raw_text)
    
    return JobAnalysisResponse(
        role=extracted_data.get("role", "Unknown"),
        company=extracted_data.get("company", "Unknown"),
        skills=extracted_data.get("requirements", [])
    )

@router.post("/optimize-resume")
async def optimize_resume(request: ResumeOptimizationRequest):
    """
    Resume Optimization Agent: Modifies resume bullets based on Job ID requirements.
    """
    modified_resume = request.master_resume_json.copy()
    
    # Weave target skills into the basics summary using the AI Engine
    if "basics" in modified_resume and "summary" in modified_resume["basics"]:
        current_summary = modified_resume["basics"]["summary"]
        improved_summary = ai_engine.improve_bullet_point(
            current_summary, 
            target_skills=["Leadership", "Python", "System Architecture"]
        )
        modified_resume["basics"]["summary"] = improved_summary
    
    return {
        "status": "success",
        "ats_score_estimate": 85,
        "optimized_resume": modified_resume
    }

@router.post("/generate-referral")
async def generate_referral(request: ReferralGenerationRequest):
    """
    Referral Agent: Drafts a connection request or email.
    """
    draft = ai_engine.generate_referral_draft(
        company=request.company, 
        role=request.role, 
        connection_name=request.connection_name
    )
    
    return {"draft": draft}

@router.post("/plan-application/{job_id}")
async def plan_application(job_id: str):
    """
    Application Planner Agent: Generates execution steps (State Machine).
    """
    # Simulate fetching job metadata from DB to pass to the Engine
    mock_metadata = {"has_connections": True} 
    plan = ai_engine.generate_application_plan(mock_metadata)
    
    return {"job_id": job_id, "status": "awaiting_approval", "plan": plan}

@router.post("/update-status")
async def update_status(payload: n8nCallback):
    """
    Callback for n8n to report execution results back to the AI Brain.
    """
    print(f"n8n reported status for Job {payload.job_id}: {payload.status}")
    return {"status": "acknowledged"}

@router.post("/chat")
async def chat_with_agent(request: ChatRequest):
    """
    General conversational endpoint to talk with the J.A.R.A AI Brain.
    """
    reply = ai_engine.generate_chat_response(request.message)
    return {"reply": reply}
