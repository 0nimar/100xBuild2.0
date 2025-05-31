from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class TrackingData(BaseModel):
    ip_address: str
    domain: str
    page_path: str  # URL without domain
    page_title: Optional[str] = None
    user_agent: Optional[str] = None
    device_type: Optional[str] = None  # mobile, tablet, desktop
    device_browser: Optional[str] = None
    device_os: Optional[str] = None
    referrer: Optional[str] = None
    language: Optional[str] = None
    screen_resolution: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    session_id: Optional[str] = None
    session_start: Optional[datetime] = None
    session_end: Optional[datetime] = None
    session_duration: Optional[float] = None  # in seconds
    is_session_start: bool = False
    is_session_end: bool = False
    client_type: str  # 'react' or 'script'

    def __init__(self, **data):
        super().__init__(**data)
        if self.session_start is None:
            self.session_start = self.timestamp
            self.is_session_start = True

    def end_session(self):
        self.session_end = datetime.utcnow()
        self.is_session_end = True
        self.session_duration = (self.session_end - self.session_start).total_seconds()

    def update_session(self, new_data):
        self.session_end = new_data['timestamp']
        self.is_session_end = True
        self.session_duration = (self.session_end - self.session_start).total_seconds()

    def is_active(self):
        return not self.is_session_end 