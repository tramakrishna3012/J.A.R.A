import smtplib
from email.message import EmailMessage
import asyncio
from typing import List, Dict, Any
from app.db.supabase_client import supabase
from datetime import datetime
import base64

class EmailSenderService:
    def __init__(self):
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        
    def send_email(self, sender_email: str, sender_password: str, to_email: str, subject: str, body: str, oauth_token: str = None) -> bool:
        """Sends an email synchronously using SMTP."""
        # For safety/demo if no real credentials, we just simulate
        if not sender_email or "demo" in sender_email or sender_email == "test@example.com":
            print(f"SIMULATED SEND: To {to_email} | Subject: {subject}")
            return True
            
        msg = EmailMessage()
        msg.set_content(body)
        msg['Subject'] = subject
        msg['From'] = sender_email
        msg['To'] = to_email

        try:
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                
                if oauth_token:
                    auth_string = f"user={sender_email}\x01auth=Bearer {oauth_token}\x01\x01"
                    server.docmd("AUTH", "XOAUTH2 " + base64.b64encode(auth_string.encode('utf-8')).decode('utf-8'))
                else:
                    server.login(sender_email, sender_password)
                    
                server.send_message(msg)
            return True
        except Exception as e:
            print(f"Failed to send email to {to_email}: {e}")
            return False

    async def process_campaign_queue(self, user_id: str, campaign_id: str, sender_email: str, sender_pwd: str = None, token: str = None):
        """Background task to process a campaign's generated emails with rate limiting."""
        # Mark campaign as running
        supabase.table("outreach_campaigns").update({"status": "running"}).eq("id", campaign_id).execute()
        
        while True:
            # Fetch pending contacts that have a generated body
            res = supabase.table("outreach_contacts").select("*").eq("campaign_id", campaign_id).eq("status", "generated").limit(5).execute()
            pending_contacts = res.data if res.data else []
            
            if not pending_contacts:
                break # All done or none ready
                
            for contact in pending_contacts:
                success = self.send_email(
                    sender_email=sender_email,
                    sender_password=sender_pwd,
                    to_email=contact["email"],
                    subject=contact["subject"],
                    body=contact["body"],
                    oauth_token=token
                )
                
                status = "sent" if success else "failed"
                error_msg = "" if success else "SMTP Error"
                
                supabase.table("outreach_contacts").update({
                    "status": status,
                    "error_message": error_msg,
                    "updated_at": datetime.now().isoformat()
                }).eq("id", contact["id"]).execute()
                
                # Strict rate limit: 30 seconds
                await asyncio.sleep(30)
                
        # Check if there are any remaining pending ones (e.g. they weren't generated)
        # If not, mark completed
        rem_res = supabase.table("outreach_contacts").select("id").eq("campaign_id", campaign_id).in_("status", ["pending", "generated"]).execute()
        if rem_res.data and len(rem_res.data) == 0:
            supabase.table("outreach_campaigns").update({"status": "completed"}).eq("id", campaign_id).execute()

email_sender = EmailSenderService()
