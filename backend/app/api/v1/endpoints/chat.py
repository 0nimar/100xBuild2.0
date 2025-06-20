from fastapi import APIRouter, Request, Response, HTTPException
from app.utils.helpers import format_response
from app.config.gemini import GEMINI_API_KEY, GEMINI_MODEL_NAME
import google.generativeai as genai
from app.utils.utils import load_txt_file
from pydantic import BaseModel, Field
from .tracking import get_domain_analytics as get_tracking_analytics
from functools import lru_cache
import json
import os
from app.services.chat import chat_history
router = APIRouter()

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, description="The user's query or question")
    
    class Config:
        json_schema_extra = {
            "example": {
                "query": "What are the key metrics for user engagement?"
            }
        }

async def get_domain_analytics(domain: str):
    
    return await get_tracking_analytics(domain)

def get_model(domain_analytics: str):
    # Load analytics prompt
    analytics_prompt = load_txt_file(file_name="analytics.txt")
    
    # Load data.json
    data_path = os.path.join("app", "db", "data.json")
    with open(data_path, 'r') as f:
        data_context = json.load(f)
    
    # Combine both contexts
    system_prompt = f"""
    {analytics_prompt}
    
    here is the domain analytics:
    {domain_analytics}
    
    Here is the current domain data full context data:
    {json.dumps(data_context, indent=2)}
    """
    
    return genai.GenerativeModel(model_name=GEMINI_MODEL_NAME, system_instruction=system_prompt)

@router.post("/send")
async def send(request: ChatRequest):
    try:
        # Get the model with analytics prompt
        
        await chat_history.initialize()
        domain_analytics = await get_domain_analytics("test-site.com")
        print(domain_analytics)
        model = get_model(domain_analytics)
        
        # Get domain analytics
        # await chat_history.save_chat_history(request.query)
        
        # Send message and get response
        response = model.generate_content(
            f"user query: {request.query}",
            generation_config=genai.GenerationConfig()
        )
        # await chat_history.save_chat_history(response.text)
        return format_response(
            status=True,
            data=response.text,
            message="Chat response generated successfully"
        )

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/chat/history/{domain}")
async def get_chat_history(domain:str):
    """Get detailed analytics for a specific domain"""
    try:
        # Initialize tracking service
        await chat_history.initialize()
        
        # Get all tracking data for the domain
        chat_history_response = await chat_history.collection.find({"domain":domain}).to_list(None)
        
        if not chat_history_response:
            raise HTTPException(status_code=404, detail=f"No data found")
        
        return format_response(
            message=f"chats retrieved successfully",
            data=chat_history_response
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        print(e)    
        raise HTTPException(status_code=500, detail=str(e)) 