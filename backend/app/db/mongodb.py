from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from fastapi import HTTPException

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    async def connect_to_mongodb(self):
        try:
            if self.client is None:
                self.client = AsyncIOMotorClient(settings.MONGODB_URL)
                self.db = self.client[settings.MONGODB_DB_NAME]
                # Test the connection
                await self.db.command('ping')
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to connect to MongoDB: {str(e)}")

    async def close_mongodb_connection(self):
        if self.client:
            self.client.close()
            self.client = None
            self.db = None

    def get_db(self):
        if self.db is None:
            raise HTTPException(status_code=500, detail="Database not initialized")
        return self.db

mongodb = MongoDB() 