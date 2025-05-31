from typing import Any, Dict
from datetime import datetime

def format_response(data: Any = None, message: str = "Success", status: bool = True) -> Dict:
    """
    Format API response in a consistent way
    """
    return {
        "status": status,
        "message": message,
        "data": data,
        "timestamp": datetime.utcnow().isoformat()
    }

def format_error(message: str = "Error", status: bool = False) -> Dict:
    """
    Format error response in a consistent way
    """
    return format_response(message=message, status=status) 