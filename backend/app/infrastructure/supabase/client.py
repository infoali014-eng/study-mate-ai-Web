from supabase import create_client, Client
from .config import get_supabase_settings

_supabase_client: Client | None = None

def get_supabase_client() -> Client:
    """
    Returns a production-ready singleton instance of the Supabase Client.
    Validates configuration prior to initialization.
    """
    global _supabase_client
    if _supabase_client is None:
        settings = get_supabase_settings()
        _supabase_client = create_client(
            settings.supabase_url,
            settings.supabase_service_role_key
        )
    return _supabase_client
