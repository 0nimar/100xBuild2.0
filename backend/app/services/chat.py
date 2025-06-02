import json
from app.db.mongodb import mongodb
from app.models.tracking import TrackingData
from fastapi import Request, HTTPException
import uuid
import ast
class ChatHistoryService:
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
                self.collection = self.db.chat_history
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database initialization error: {str(e)}")
    async def save_chat_history(self,chat_message:str):
        await self.initialize()

        # chat_message_processed={"status":status,
        #                         "domain":domain,
        #                         "data":data,
        #                         "timestamp":timestamp
        #                         }
        await self.collection.insert_one(json.dumps(chat_message).dict())
chat_history=ChatHistoryService()