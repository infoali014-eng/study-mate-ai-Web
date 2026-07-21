import os
from dotenv import load_dotenv
from pydantic import BaseModel, ValidationError

# Load local environment variables from .env
load_dotenv()

class SupabaseSettings(BaseModel):
    supabase_url: str
    supabase_service_role_key: str

def get_supabase_settings() -> SupabaseSettings:
    """
    Retrieves and validates Supabase credentials from local environment variables.
    Raises ValueError if required variables are missing or invalid.
    """
    try:
        url = os.getenv("SUPABASE_URL", "")
        service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

        if not url:
            raise ValueError("SUPABASE_URL environment variable is required and cannot be empty.")
        if not service_role_key:
            raise ValueError("SUPABASE_SERVICE_ROLE_KEY environment variable is required and cannot be empty.")

        settings = SupabaseSettings(
            supabase_url=url,
            supabase_service_role_key=service_role_key
        )
        return settings
    except ValidationError as e:
        raise ValueError(f"Supabase credentials validation failed: {e}")
