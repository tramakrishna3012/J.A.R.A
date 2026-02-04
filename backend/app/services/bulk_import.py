import pandas as pd
import io
from fastapi import UploadFile
from app.services.email import email_service 

class BulkImportService:
    @staticmethod
    async def parse_jobs_file(file: UploadFile, type: str = "jobs") -> list[dict]:
        """
        Parses CSV/Excel.
        type="jobs": Returns job list.
        type="hr": Generates and sends referral emails immediately (or returns drafts).
        """
        content = await file.read()
        
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(content))
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(io.BytesIO(content))
        else:
            return []

        # Normalize headers
        df.columns = [c.lower().strip() for c in df.columns]
        
        results = []
        
        if type == "jobs":
            for _, row in df.iterrows():
                job = {
                    "company": row.get("company", "Unknown"),
                    "title": row.get("role") or row.get("title") or row.get("position", "Unknown Role"),
                    "job_link": row.get("link") or row.get("url", ""),
                    "status": row.get("status", "Saved"),
                    "hr_email": row.get("email") or row.get("hr_email", "")
                }
                if job["company"] != "Unknown" or job["title"] != "Unknown Role":
                    results.append(job)
            return results

        elif type == "hr":
            # HR Referral Logic
            for _, row in df.iterrows():
                # Fuzzy get
                email = row.get('email') or row.get('mail') or row.get('contact')
                name = row.get('name') or row.get('hr name') or row.get('recruiter')
                company = row.get('company') or row.get('firm') or "their company"
                role = row.get('role') or row.get('position') or "open role"

                if email and "@" in str(email):
                    # Generate Context for Email Service
                    context = {
                        "target_name": name, 
                        "company": company, 
                        "role": role,
                        "sender_name": "Applicant" 
                    }
                    
                    # Generate Body
                    body = email_service.generate_template("referral", context)
                    
                    # Simulate Sending
                    email_service.send_email(email, f"Inquiry regarding {role}", body)
                    
                    results.append({
                        "status": "sent",
                        "to": email,
                        "name": name,
                        "company": company
                    })
        
        return results

bulk_import_service = BulkImportService()
