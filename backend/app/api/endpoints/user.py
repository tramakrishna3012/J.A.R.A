from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from app.api import deps
from app.db.supabase import supabase

router = APIRouter()

@router.get("/me")
def read_user_me(
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    """
    Get current user profile.
    """
    # Fetch additional profile data from 'users' table if needed
    # response = supabase.table("users").select("*").eq("id", current_user.id).execute()
    
    return {
        "id": current_user.id,
        "email": current_user.email,
        # "profile": response.data[0] if response.data else None
    }

@router.post("/update")
def update_user_profile(
    profile_data: dict,
    current_user: Any = Depends(deps.get_current_user)
) -> Any:
    """
    Update user profile data in the 'users' table.
    """
    try:
        data = {**profile_data, "id": current_user.id}
        result = supabase.table("users").upsert(data).execute()
        return result.data
    except Exception as e:
         raise HTTPException(status_code=400, detail=str(e))
