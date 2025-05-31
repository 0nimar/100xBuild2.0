from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    async def connect_to_mongodb(self):
        self.client = AsyncIOMotorClient(settings.MONGODB_URL)
        self.db = self.client[settings.MONGODB_DB_NAME]

    async def close_mongodb_connection(self):
        if self.client:
            self.client.close()

    def get_db(self):
        return self.db

mongodb = MongoDB() 