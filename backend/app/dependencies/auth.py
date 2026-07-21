from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import Client
from app.infrastructure.supabase.client import get_supabase_client

security = HTTPBearer()

def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    supabase_client: Client = Depends(get_supabase_client)
) -> str:
    """
    Dependency that extracts the Bearer token, validates it against Supabase Auth,
    and returns the authenticated user's UUID string.
    Raises 401 Unauthorized if token validation fails.
    """
    token = credentials.credentials
    try:
        # Validate JWT token via Supabase Auth server
        response = supabase_client.auth.get_user(token)
        if not response or not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication session or token."
            )
        return response.user.id
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )
