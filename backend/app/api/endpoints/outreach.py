from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File, Form
from typing import Any, List, Dict
from app.api import deps
from app.services.outreach_service import outreach_service
from app.services.email_sender import email_sender
from app.services.ai_engine import ai_engine
from app.db.supabase_client import supabase

router = APIRouter()

@router.post("/upload")
async def upload_hr_list(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    campaign_name: str = Form(...),
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """Uploads a CSV/Excel file of HR contacts and creates a new outreach campaign."""
    if not file.filename.endswith(('.csv', '.xlsx')):
        raise HTTPException(status_code=400, detail="Only CSV or XLSX files are supported")
        
    try:
        contents = await file.read()
        contacts = outreach_service.parse_csv(contents)
        
        if not contacts:
            raise HTTPException(status_code=400, detail="No valid contacts found in the uploaded file")
            
        result = outreach_service.create_campaign(current_user["id"], campaign_name, contacts)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process upload: {str(e)}")

@router.post("/{campaign_id}/generate")
async def generate_outreach_emails(
    campaign_id: str,
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """Uses AI to generate personalized emails for all pending contacts in the campaign."""
    campaign_data = outreach_service.get_campaign(current_user["id"], campaign_id)
    if not campaign_data:
        raise HTTPException(status_code=404, detail="Campaign not found")
        
    # Get user profile for context
    user_res = supabase.table("profiles").select("resume_data").eq("id", current_user["id"]).execute()
    user_profile = user_res.data[0].get("resume_data", {}) if user_res.data else {}
    
    contacts = campaign_data.get("contacts", [])
    
    # In a real app with many contacts, this should be a background task.
    # For MVP and small lists, synchronous AI generation (or fast templates) is ok.
    generated_count = 0
    for contact in contacts:
        if contact.get("status") == "pending":
            try:
                # Prepare context
                hr_context = {
                    "hr_name": contact.get("hr_name", ""),
                    "company": contact.get("company", ""),
                    "role": contact.get("role", "")
                }
                
                body = ai_engine.generate_outreach_email(hr_context, user_profile)
                subject = f"Application for {hr_context['role']} at {hr_context.get('company', 'your company')}"
                
                supabase.table("outreach_contacts").update({
                    "body": body,
                    "subject": subject,
                    "status": "generated"
                }).eq("id", contact["id"]).execute()
                
                generated_count += 1
            except Exception as e:
                print(f"Error generating for contact {contact['id']}: {e}")
                
    return {"status": "success", "generated_count": generated_count}

@router.post("/{campaign_id}/send")
async def send_outreach_campaign(
    campaign_id: str,
    background_tasks: BackgroundTasks,
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """Starts the background task to send all generated emails in the campaign."""
    campaign_data = outreach_service.get_campaign(current_user["id"], campaign_id)
    if not campaign_data:
        raise HTTPException(status_code=404, detail="Campaign not found")
        
    # User needs SMTP credentials or Google OAuth token
    # For this demo, we can just pass the user email and a generic token
    # Ideally, we get this from the user's settings or the active session
    sender_email = current_user.get("email", "test@example.com")
    
    background_tasks.add_task(
        email_sender.process_campaign_queue,
        user_id=current_user["id"],
        campaign_id=campaign_id,
        sender_email=sender_email
    )
    
    return {"status": "success", "message": "Campaign queued for sending. Rate limits apply."}

@router.get("/")
async def list_campaigns(
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """Lists all campaigns for the current user."""
    campaigns = outreach_service.get_campaigns_for_user(current_user["id"])
    return {"status": "success", "data": campaigns}

@router.get("/{campaign_id}")
async def get_campaign_status(
    campaign_id: str,
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """Gets the status and metrics of a specific campaign."""
    campaign_data = outreach_service.get_campaign(current_user["id"], campaign_id)
    if not campaign_data:
        raise HTTPException(status_code=404, detail="Campaign not found")
        
    contacts = campaign_data.get("contacts", [])
    
    metrics = {
        "total": len(contacts),
        "pending": sum(1 for c in contacts if c["status"] == "pending"),
        "generated": sum(1 for c in contacts if c["status"] == "generated"),
        "sent": sum(1 for c in contacts if c["status"] == "sent"),
        "failed": sum(1 for c in contacts if c["status"] == "failed")
    }
    
    return {"status": "success", "campaign": campaign_data["campaign"], "contacts": contacts, "metrics": metrics}
