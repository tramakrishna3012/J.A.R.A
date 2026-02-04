from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from pydantic import BaseModel
from app.services.email_reader import email_reader

router = APIRouter()

class EmailConnectRequest(BaseModel):
    email: str
    password: str # App Password

@router.post("/fetch")
def fetch_emails(request: EmailConnectRequest) -> Any:
    """
    Connect to IMAP and fetch recent emails.
    NOTE: In a real app, NEVER send passwords in plain text or store them.
    This is a session-based fetch for the user's dashboard.
    """
    emails = email_reader.connect_and_fetch(request.email, request.password)
    if emails and "error" in emails[0]:
        raise HTTPException(status_code=400, detail=emails[0]["error"])
    return emails
