from fastapi import APIRouter, Depends, HTTPException
from typing import Any, List
from app.api import deps
from app.db.supabase import supabase
from app.services.bulk_import import bulk_import_service
from app.services.ai_engine import ai_engine
from fastapi import UploadFile, File, Body

router = APIRouter()

@router.get("/", response_model=List[dict])
def get_jobs(
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    """
    Get all jobs for the current user.
    """
    result = supabase.table("jobs").select("*").eq("user_id", current_user.id).order("created_at", desc=True).execute()
    return result.data

@router.post("/")
def create_job(
    job_in: dict,
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    """
    Manually add a job to track.
    """
    job_data = {**job_in, "user_id": current_user.id, "status": "Saved"}
    result = supabase.table("jobs").insert(job_data).execute()
    return result.data[0]

@router.delete("/{job_id}")
def delete_job(
    job_id: str,
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    """
    Delete a job application.
    """
    result = supabase.table("jobs").delete().eq("id", job_id).eq("user_id", current_user.id).execute()
    return {"message": "Job deleted"}

@router.post("/upload")
async def upload_jobs(
    file: UploadFile = File(...),
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    """
    Bulk upload jobs from CSV or Excel.
    """
    jobs = await bulk_import_service.parse_jobs_file(file)
    
    if not jobs:
         raise HTTPException(status_code=400, detail="No valid jobs found in file")
         
    # Add user_id to all
    for job in jobs:
        job["user_id"] = current_user.id
        
    # Bulk insert
    try:
        result = supabase.table("jobs").insert(jobs).execute()
        return {"message": f"Successfully imported {len(result.data)} jobs", "jobs": result.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Import failed: {str(e)}")

@router.post("/analyze")
def analyze_job_match(
    request: dict = Body(...),
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    """
    Analyze match between a Job Description and the User's Resume.
    Request body: { "job_description": "...", "resume_text": "..." }
    """
    job_desc = request.get("job_description", "")
    resume_text = request.get("resume_text")

    # If resume_text is missing, try to fetch the master resume from DB
    if not resume_text:
        res = supabase.table("resumes").select("content_json").eq("user_id", current_user.id).eq("is_master", True).execute()
        if res.data:
            # Simplification: Convert JSON back to text or use a stored text field
            # For now, we assume content_json might have a raw_text field due to our earlier parser
            resume_text = res.data[0]["content_json"].get("raw_text", "")
    
    if not job_desc or not resume_text:
        raise HTTPException(status_code=400, detail="Missing job description or resume data")

    analysis = ai_engine.analyze_job_match(resume_text, job_desc)
    
    # Optional: Improve specific bullet points if requested
    # improved_summary = ai_engine.improve_bullet_point(resume_text[:200]) 
    
    return analysis


