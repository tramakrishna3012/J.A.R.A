from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from app.api import deps
from app.services.email import email_service
from pydantic import BaseModel

router = APIRouter()

class EmailDraftRequest(BaseModel):
    type: str # 'referral', 'followup', 'cold_outreach'
    context: dict

class EmailSendRequest(BaseModel):
    to_email: str
    subject: str
    body: str

@router.post("/draft")
def draft_email(
    request: EmailDraftRequest,
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    """
    Generate an email draft based on context.
    """
    request.context["sender_name"] = current_user.email.split("@")[0] # Best guess if name null
    draft = email_service.generate_template(request.type, request.context)
    return {"draft": draft}

@router.post("/send")
def send_email(
    request: EmailSendRequest,
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    """
    Send an email (simulated for now).
    """
    success = email_service.send_email(request.to_email, request.subject, request.body)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send email")
    return {"status": "sent", "message": "Email queued successfully"}
