from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import test, tracking, chat
from app.db.mongodb import mongodb
from typing import List

app = FastAPI(
    title="FastAPI Template",
    description="A template FastAPI application",
    version="1.0.0"
)

# Store active WebSocket connections
active_connections: List[WebSocket] = []

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
app.include_router(chat.router, prefix="/api/v1", tags=["chat"])
@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI Template"}

async def broadcast_active_connections():
    """Broadcast the number of active connections to all clients"""
    for connection in active_connections[:]:  # Create a copy of the list to safely modify it
        try:
            await connection.send_json({"activeConnections": len(active_connections)})
        except:
            if connection in active_connections:  # Check if connection still exists
                active_connections.remove(connection)

@app.websocket("/ws/counter")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    # Broadcast initial count to all clients
    await broadcast_active_connections()
    
    try:
        while True:
            # Keep the connection alive
            await websocket.receive_text()
    except:
        if websocket in active_connections:  # Check if websocket still exists
            active_connections.remove(websocket)
        # Broadcast updated count when a client disconnects
        await broadcast_active_connections()

@app.get("/api/v1/active-connections")
async def get_active_connections():
    return {"activeConnections": len(active_connections)}

@app.on_event("startup")
async def startup_db_client():
    await mongodb.connect_to_mongodb()

@app.on_event("shutdown")
async def shutdown_db_client():
    await mongodb.close_mongodb_connection()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
