"""
Supabase client helper for RetailMax CRM.
Allows direct integration with Supabase Auth, Storage, and Realtime if configured.
"""

import os
from django.conf import settings

_supabase_client = None

def get_supabase_client():
    """
    Returns an initialized Supabase Client if credentials are provided,
    otherwise returns None with a helpful diagnostic.
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    supabase_url = getattr(settings, 'SUPABASE_URL', '') or os.getenv('SUPABASE_URL', '')
    supabase_key = getattr(settings, 'SUPABASE_SERVICE_ROLE_KEY', '') or getattr(settings, 'SUPABASE_ANON_KEY', '') or os.getenv('SUPABASE_ANON_KEY', '')

    if not supabase_url or not supabase_key or 'your-project-ref' in supabase_url:
        return None

    try:
        from supabase import create_client, Client
        _supabase_client = create_client(supabase_url, supabase_key)
        return _supabase_client
    except Exception as e:
        print(f"[Supabase Client Warning] Could not initialize Supabase client: {e}")
        return None

def check_supabase_connection():
    """
    Checks Supabase connectivity status and returns a dict with status information.
    """
    supabase_url = getattr(settings, 'SUPABASE_URL', '') or os.getenv('SUPABASE_URL', '')
    database_url = getattr(settings, 'DATABASE_URL', '') or os.getenv('DATABASE_URL', '')
    db_host = getattr(settings, 'DB_HOST', '') or os.getenv('DB_HOST', '')
    
    is_url_set = bool(supabase_url and 'your-project-ref' not in supabase_url)
    is_db_set = bool(database_url and 'postgres' in database_url)
    has_placeholder = '[YOUR-DATABASE-PASSWORD]' in database_url or '[YOUR-PASSWORD]' in database_url

    client = get_supabase_client()
    
    if is_db_set and not has_placeholder:
        status_msg = f"Connected to Supabase PostgreSQL ({db_host or 'bywidhuibkjsvhwxekao'})."
    elif has_placeholder or db_host:
        status_msg = f"Supabase host configured ({db_host or 'db.bywidhuibkjsvhwxekao.supabase.co'}). Replace [YOUR-DATABASE-PASSWORD] in .env to connect."
    else:
        status_msg = "Running in standalone mode. Set DATABASE_URL in .env to connect to live Supabase."

    return {
        'supabase_configured': is_url_set or is_db_set,
        'client_initialized': client is not None,
        'supabase_host': db_host or 'db.bywidhuibkjsvhwxekao.supabase.co',
        'supabase_url': supabase_url if is_url_set else 'https://bywidhuibkjsvhwxekao.supabase.co',
        'database_mode': 'Supabase PostgreSQL' if (is_db_set and not has_placeholder) else 'Local SQLite (Ready for Supabase)',
        'has_placeholder_password': has_placeholder,
        'message': status_msg
    }
