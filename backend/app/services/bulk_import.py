import pandas as pd
import io
from fastapi import UploadFile

class BulkImportService:
    @staticmethod
    async def parse_jobs_file(file: UploadFile) -> list[dict]:
        """
        Parses CSV or Excel file and returns a list of job dictionaries.
        Expected columns: Company, Role, Link, Status, Notes
        """
        content = await file.read()
        filename = file.filename.lower()
        
        try:
            if filename.endswith('.csv'):
                df = pd.read_csv(io.BytesIO(content))
            elif filename.endswith(('.xls', '.xlsx')):
                df = pd.read_excel(io.BytesIO(content))
            else:
                raise ValueError("Unsupported file format. Use CSV or Excel.")
                
            # Normalize Headers
            df.columns = [c.lower().strip() for c in df.columns]
            
            jobs = []
            for _, row in df.iterrows():
                # Flexible extraction
                job = {
                    "company": row.get("company", "Unknown"),
                    "title": row.get("role") or row.get("title") or row.get("position", "Unknown Role"),
                    "job_link": row.get("link") or row.get("url", ""),
                    "status": row.get("status", "Saved"),
                    "hr_email": row.get("email") or row.get("hr_email", "")
                }
                
                # Filter out empty rows
                if job["company"] != "Unknown" or job["title"] != "Unknown Role":
                    jobs.append(job)
                    
            return jobs
            
        except Exception as e:
            print(f"Bulk Import Error: {e}")
            return []

bulk_import_service = BulkImportService()
