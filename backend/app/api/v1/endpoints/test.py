from fastapi import APIRouter, HTTPException
from app.utils.helpers import format_response, format_error
from app.db.mongodb import mongodb
from datetime import datetime

router = APIRouter()

@router.get("/test")
async def test_endpoint():
    try:
        # Test MongoDB connection
        db = mongodb.get_db()
        test_collection = db.test_collection
        
        # Create a test document
        test_doc = {
            "message": "Test successful",
            "timestamp": datetime.utcnow()
        }
        
        # Insert the document
        result = await test_collection.insert_one(test_doc)
        
        # Retrieve the document
        inserted_doc = await test_collection.find_one({"_id": result.inserted_id})
        
        return format_response(
            data={
                "message": "MongoDB connection successful",
                "document": str(inserted_doc)
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        ) 