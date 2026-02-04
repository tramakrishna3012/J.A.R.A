from typing import Annotated
from fastapi import Header, HTTPException, status, Depends
from app.db.supabase import supabase

async def get_current_user(authorization: Annotated[str | None, Header()] = None):
    """
    Verifies the Supabase JWT token from the Authorization header.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization Header",
        )
    
    try:
        # Supabase client expects the raw token usually, but sometimes 'Bearer <token>'
        # We'll try to get the user from the token.
        # Alternatively, we can just pass the token to supabase.auth.get_user(token)
        
        token = authorization.split(" ")[1] if " " in authorization else authorization
        
        user = supabase.auth.get_user(token)
        
        if not user:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Token",
            )
            
        return user.user
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication Failed: {str(e)}",
        )
