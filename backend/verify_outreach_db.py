import asyncio
import os
import sys

# Add backend directory to python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.supabase_client import supabase

def verify_db():
    print("Checking if outreach_campaigns table exists...")
    try:
        res = supabase.table("outreach_campaigns").select("*").limit(1).execute()
        print("SUCCESS! The table 'outreach_campaigns' exists and is accessible.")
        print(f"Current rows: {len(res.data)}")
        return True
    except Exception as e:
        print("FAILED to access 'outreach_campaigns'.")
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    verify_db()
