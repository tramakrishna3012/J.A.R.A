import pandas as pd
from typing import List, Dict, Any, Optional
from app.db.supabase_client import supabase
from io import BytesIO

class OutreachService:
    def parse_csv(self, file_bytes: bytes) -> List[Dict[str, Any]]:
        """Parses an uploaded CSV and returns a list of dictionaries with normalized keys."""
        df = pd.read_csv(BytesIO(file_bytes))
        
        # Normalize column names (lowercase, replace spaces with underscores)
        df.columns = [str(c).lower().strip().replace(' ', '_') for c in df.columns]
        
        # Expected mapping to DB columns
        records = []
        for _, row in df.iterrows():
            record = {
                "hr_name": row.get("name", row.get("hr_name", "")),
                "company": row.get("company", ""),
                "role": row.get("role", row.get("title", "")),
                "email": row.get("email", ""),
                "linkedin_url": row.get("linkedin", row.get("linkedin_url", "")),
                "notes": row.get("notes", "")
            }
            
            # Clean nan values
            for k, v in record.items():
                if pd.isna(v):
                    record[k] = ""
                    
            if record["email"] or record["linkedin_url"] or record["company"]:    
                records.append(record)
                
        return records

    def create_campaign(self, user_id: str, name: str, contacts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Creates a campaign and batch inserts associated contacts."""
        # Insert campaign
        camp_res = supabase.table("outreach_campaigns").insert({
            "user_id": user_id,
            "name": name,
            "status": "draft"
        }).execute()
        
        if not camp_res.data:
            raise Exception("Failed to create campaign")
            
        campaign_id = camp_res.data[0]["id"]
        
        # Prepare contacts
        for contact in contacts:
            contact["campaign_id"] = campaign_id
            
        # Batch insert contacts
        contact_res = supabase.table("outreach_contacts").insert(contacts).execute()
        
        return {
            "campaign": camp_res.data[0],
            "contacts_count": len(contact_res.data) if contact_res.data else 0
        }

    def get_campaign(self, user_id: str, campaign_id: str) -> Optional[Dict[str, Any]]:
        """Fetches a campaign and its contacts."""
        camp_res = supabase.table("outreach_campaigns").select("*").eq("id", campaign_id).eq("user_id", user_id).execute()
        if not camp_res.data:
            return None
            
        contacts_res = supabase.table("outreach_contacts").select("*").eq("campaign_id", campaign_id).execute()
        
        return {
            "campaign": camp_res.data[0],
            "contacts": contacts_res.data if contacts_res.data else []
        }
        
    def get_campaigns_for_user(self, user_id: str) -> List[Dict[str, Any]]:
        """Fetches all campaigns for a user."""
        res = supabase.table("outreach_campaigns").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return res.data if res.data else []

outreach_service = OutreachService()
