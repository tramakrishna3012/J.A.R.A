import imaplib
import email
from email.header import decode_header
import os
from typing import List, Dict
from datetime import datetime

class EmailReaderService:
    def __init__(self):
        # In a real app, these should be passed per-request or stored securely encrypted in DB
        # For this free-tier demo, we will accept them as parameters or env vars
        self.imap_server = "imap.gmail.com"

    def connect_and_fetch(self, username: str, password: str, oauth_token: str = None, limit: int = 10) -> List[Dict]:
        """
        Connects to IMAP, searches for recent emails, and returns simplified objects.
        """
        try:
            # Connect to the server
            mail = imaplib.IMAP4_SSL(self.imap_server)
            
            if oauth_token:
                # Generate XOAUTH2 string
                auth_string = f"user={username}\x01auth=Bearer {oauth_token}\x01\x01"
                mail.authenticate("XOAUTH2", lambda x: auth_string.encode("utf-8"))
            else:
                mail.login(username, password)
                
            mail.select("inbox")

            # Search for all emails (you can filter by date if needed)
            status, messages = mail.search(None, "ALL")
            if status != "OK":
                return []

            # Get the list of email IDs, slice by limit (most recent first)
            email_ids = messages[0].split()
            latest_email_ids = email_ids[-limit:]
            latest_email_ids.reverse()

            results = []

            for e_id in latest_email_ids:
                res, msg_data = mail.fetch(e_id, "(RFC822)")
                for response_part in msg_data:
                    if isinstance(response_part, tuple):
                        msg = email.message_from_bytes(response_part[1])
                        
                        # Decode Subject
                        subject, encoding = decode_header(msg["Subject"])[0]
                        if isinstance(subject, bytes):
                            subject = subject.decode(encoding if encoding else "utf-8")
                        
                        # Decode From
                        from_ = msg.get("From")
                        
                        # Get Body
                        body = ""
                        try:
                            if msg.is_multipart():
                                for part in msg.walk():
                                    content_type = part.get_content_type()
                                    content_disposition = str(part.get("Content-Disposition"))
                                    if "attachment" not in content_disposition:
                                        payload = part.get_payload(decode=True)
                                        if not payload: continue
                                        
                                        if content_type == "text/plain":
                                            # Try UTF-8 first, then fallback to latin-1
                                            try:
                                                body = payload.decode('utf-8')
                                            except UnicodeDecodeError:
                                                body = payload.decode('latin-1', errors='replace')
                                            break # Prefer plain text
                                        elif content_type == "text/html":
                                            # Fallback to HTML if no plain text found yet
                                            if not body:
                                                try:
                                                    body = payload.decode('utf-8')
                                                except UnicodeDecodeError:
                                                    body = payload.decode('latin-1', errors='replace')
                            else:
                                payload = msg.get_payload(decode=True)
                                if payload:
                                    try:
                                        body = payload.decode('utf-8')
                                    except UnicodeDecodeError:
                                        body = payload.decode('latin-1', errors='replace')
                        except Exception as e:
                            print(f"Error decoding body for {e_id}: {e}")
                            body = "(Error decoding email body)"

                        # Basic Classification Preview (will be improved by AI later)
                        category = "Inbox"
                        lower_sub = subject.lower()
                        if "application" in lower_sub or "applied" in lower_sub:
                            category = "Application"
                        elif "interview" in lower_sub or "schedule" in lower_sub:
                            category = "Interview"
                        elif "reject" in lower_sub or "unfortunately" in lower_sub:
                            category = "Rejection"

                        # Clean snippet (remove HTML tags)
                        import re
                        clean_text = re.sub(r'<[^>]+>', '', body)
                        # Remove extra whitespace
                        clean_text = " ".join(clean_text.split())

                        results.append({
                            "id": e_id.decode(),
                            "subject": subject,
                            "from": from_,
                            "snippet": clean_text[:200] + "...", # Truncate for display
                            "date": msg.get("Date"),
                            "body": body, # Send full body for detail view
                            "category": category
                        })

            mail.close()
            mail.logout()
            return results
        except Exception as e:
            print(f"IMAP Error: {e}")
            return [{"error": str(e)}]

email_reader = EmailReaderService()
