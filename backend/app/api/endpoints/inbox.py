from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from pydantic import BaseModel
from app.services.email_reader import email_reader

router = APIRouter()

class EmailConnectRequest(BaseModel):
    email: str
    password: str = None  # App Password (optional if oauth_token provided)
    oauth_token: str = None # Gmail OAuth Token

@router.post("/fetch")
def fetch_emails(request: EmailConnectRequest) -> Any:
    """
    Connect to IMAP and fetch recent emails.
    NOTE: In a real app, NEVER send passwords in plain text or store them.
    This is a session-based fetch for the user's dashboard.
    """
    if not request.password and not request.oauth_token:
        raise HTTPException(status_code=400, detail="Either password or oauth_token is required")
        
    print(f"DEBUG: Connecting with {request.email}, has_pwd={bool(request.password)}, has_token={bool(request.oauth_token)}")
    emails = email_reader.connect_and_fetch(request.email, request.password, request.oauth_token)
    if emails and "error" in emails[0]:
        print(f"DEBUG: IMAP Error Result: {emails[0]['error']}")
        raise HTTPException(status_code=400, detail=f"IMAP Error: {emails[0]['error']}")
    return emails
    return emails
