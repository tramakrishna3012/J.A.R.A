from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
from app.services.browser import browser_service
from app.services.ai_engine import ai_engine
# from app.db.supabase_client import create_supabase_client # Unused

router = APIRouter()

class ApplicationPlanRequest(BaseModel):
    job_url: str
    resume_data: Dict[str, Any] # Pass full resume JSON for now, or fetch from DB if ID provided

class ApplicationExecuteRequest(BaseModel):
    job_url: str
    mapping: Dict[str, str]

@router.post("/plan")
async def create_application_plan(request: ApplicationPlanRequest):
    """
    1. Navigates to the Job URL.
    2. Extracts form fields.
    3. Maps Resume Data to Fields.
    4. Returns the proposed mapping for user review.
    """
    try:
        # Step 1: Extract Structure
        print(f"Extracting form from: {request.job_url}")
        form_structure = await browser_service.extract_form_structure(request.job_url)
        
        if not form_structure:
            return {"status": "error", "message": "No form fields detected. Is this an 'Easy Apply' page?"}

        # Step 2: AI Mapping
        print("Mapping resume data...")
        mapping = ai_engine.map_resume_to_fields(form_structure, request.resume_data)
        
        return {
            "status": "success",
            "form_structure": form_structure,
            "proposed_mapping": mapping
        }

    except Exception as e:
        print(f"Plan creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/execute")
async def execute_application(request: ApplicationExecuteRequest):
    """
    1. Navigates to Job URL.
    2. Fills the form using the provided mapping.
    """
    try:
        print(f"Executing application on: {request.job_url}")
        result = await browser_service.fill_form(request.job_url, request.mapping)
        
        return result

    except Exception as e:
        print(f"Execution failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
