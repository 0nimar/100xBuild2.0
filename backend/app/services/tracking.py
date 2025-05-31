from app.db.mongodb import mongodb
from app.models.tracking import TrackingData
from fastapi import Request, HTTPException
import uuid

class TrackingService:
    def __init__(self):
        self.db = None
        self.collection = None

    async def initialize(self):
        """Initialize database connection"""
        try:
            if self.db is None:
                await mongodb.connect_to_mongodb()
                self.db = mongodb.get_db()
                if self.db is None:
                    raise HTTPException(status_code=500, detail="Failed to connect to database")
                self.collection = self.db.tracking_data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database initialization error: {str(e)}")

    async def track_page_view(self, request: Request, page_url: str, client_type: str):
        # Initialize if not already done
        await self.initialize()
        
        # Get client IP
        ip = request.client.host
        
        # Get user agent
        user_agent = request.headers.get("user-agent")
        
        # Get referrer
        referrer = request.headers.get("referer")
        
        # Generate session ID if not exists
        session_id = str(uuid.uuid4())
        
        # Create tracking data
        tracking_data = TrackingData(
            ip_address=ip,
            page_url=page_url,
            user_agent=user_agent,
            referrer=referrer,
            client_type=client_type,
            session_id=session_id
        )
        
        # Insert into MongoDB
        await self.collection.insert_one(tracking_data.dict())
        
        return session_id

tracking_service = TrackingService() 