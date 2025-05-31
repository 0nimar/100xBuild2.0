from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class TrackingData(BaseModel):
    ip_address: str
    page_url: str
    page_title: Optional[str] = None
    user_agent: Optional[str] = None
    referrer: Optional[str] = None
    language: Optional[str] = None
    screen_resolution: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    client_type: str  # 'react' or 'script'
    session_id: Optional[str] = None 