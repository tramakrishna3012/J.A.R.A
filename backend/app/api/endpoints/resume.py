from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from typing import Any
from app.api import deps
from app.db.supabase import supabase
from app.services.parser import parser
import json

router = APIRouter()

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    """
    Upload a PDF resume, parse it, and store the structured data.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    content = await file.read()
    
    # 1. Parse PDF text
    raw_text = parser.extract_text_from_pdf(content)
    
    # 2. Convert to JSON (Initial Pass)
    resume_data = parser.parse_to_json(raw_text)
    
    # 3. Store file in Supabase Storage (Optional but recommended)
    file_path = f"{current_user.id}/{file.filename}"
    try:
        supabase.storage.from_("resumes").upload(
            file=content,
            path=file_path,
            file_options={"content-type": "application/pdf", "upsert": "true"}
        )
    except Exception as e:
        print(f"Storage upload failed (ignoring for free tier constraints if bucket missing): {e}")

    # 4. Store Metadata in DB
    db_entry = {
        "user_id": current_user.id,
        "content_json": resume_data,
        "is_master": True,
        "version_name": "Master V1",
        "file_path": file_path
    }
    
    result = supabase.table("resumes").insert(db_entry).execute()
    
    return result.data[0] if result.data else {"error": "Failed to save resume"}

@router.get("/{resume_id}")
def get_resume(
    resume_id: str,
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    """
    Get a specific resume by ID.
    """
    result = supabase.table("resumes").select("*").eq("id", resume_id).eq("user_id", current_user.id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Resume not found")
    return result.data[0]
