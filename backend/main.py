from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import test, tracking
from app.db.mongodb import mongodb

app = FastAPI(
    title="FastAPI Template",
    description="A template FastAPI application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include routers
app.include_router(test.router, prefix="/api/v1", tags=["test"])
app.include_router(tracking.router, prefix="/api/v1", tags=["tracking"])

@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI Template"}

@app.on_event("startup")
async def startup_db_client():
    await mongodb.connect_to_mongodb()

@app.on_event("shutdown")
async def shutdown_db_client():
    await mongodb.close_mongodb_connection()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
