from fastapi import APIRouter, Request, Response
from app.services.tracking import tracking_service
from app.utils.helpers import format_response
import json
from datetime import datetime

router = APIRouter()

@router.get("/tracking/script")
async def get_tracking_script(request: Request):
    """Get tracking script that clients can embed in their website"""
    script = """
 
    alert("Tracking script loaded!");

        console.log('Tracking script loaded'); // Debug log
        
        (function() {
            console.log('Tracking script initialized'); // Debug log
            
            // Configuration
            const TRACKING_ENDPOINT = 'http://localhost:8000/api/v1/tracking/track';
            
            // Function to get current page data
            function getPageData() {
                const data = {
                    url: window.location.href,
                    referrer: document.referrer,
                    title: document.title,
                    userAgent: navigator.userAgent,
                    language: navigator.language,
                    screenWidth: window.screen.width,
                    screenHeight: window.screen.height
                };
                console.log('Page data:', data); // Debug log
                return data;
            }
            
            // Function to send tracking data
            function trackPageView() {
                console.log('Attempting to track page view...'); // Debug log
                const data = getPageData();
                
                // Create a visible element to show tracking status
                const statusDiv = document.createElement('div');
                statusDiv.style.position = 'fixed';
                statusDiv.style.bottom = '10px';
                statusDiv.style.right = '10px';
                statusDiv.style.padding = '10px';
                statusDiv.style.background = '#f0f0f0';
                statusDiv.style.border = '1px solid #ccc';
                statusDiv.style.zIndex = '9999';
                statusDiv.textContent = 'Tracking...';
                document.body.appendChild(statusDiv);
                
                fetch(TRACKING_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    mode: 'cors',
                    credentials: 'omit',
                    body: JSON.stringify(data)
                })
                .then(response => {
                    console.log('Response received:', response); // Debug log
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Tracking successful:', data);
                    statusDiv.textContent = 'Tracking successful!';
                    statusDiv.style.background = '#dff0d8';
                    setTimeout(() => statusDiv.remove(), 3000);
                })
                .catch(error => {
                    console.error('Tracking error:', error);
                    statusDiv.textContent = 'Tracking failed: ' + error.message;
                    statusDiv.style.background = '#f2dede';
                    setTimeout(() => statusDiv.remove(), 5000);
                });
            }
            
            // Track initial page view
            console.log('Tracking initial page view...'); // Debug log
            trackPageView();
            
            // Track page changes
            window.addEventListener('popstate', () => {
                console.log('Page changed, tracking...'); // Debug log
                trackPageView();
            });
            
            // Track when user leaves the page
            window.addEventListener('beforeunload', () => {
                console.log('User leaving page, tracking...'); // Debug log
                trackPageView();
            });
            
            console.log('Tracking script setup complete'); // Debug log
        })();
  
    """
    
    return Response(content=script, media_type="application/javascript")

@router.get("/tracking/react")
async def get_tracking_component(request: Request, page_url: str):
    """Get tracking component for React implementation"""
    session_id = await tracking_service.track_page_view(request, page_url, "react")
    
    # Create React component code
    component = f"""
    import React, {{ useEffect }} from 'react';

    const TrackingComponent = () => {{
        useEffect(() => {{
            const sessionId = "{session_id}";
            const pageUrl = window.location.href;
            
            // Function to send tracking data
            const trackPageView = async () => {{
                try {{
                    await fetch('/api/v1/tracking/track', {{
                        method: 'POST',
                        headers: {{
                            'Content-Type': 'application/json',
                        }},
                        body: JSON.stringify({{
                            session_id: sessionId,
                            page_url: pageUrl
                        }})
                    }});
                }} catch (error) {{
                    console.error('Tracking error:', error);
                }}
            }};
            
            // Track initial page view
            trackPageView();
            
            // Track page changes
            window.addEventListener('popstate', trackPageView);
            
            return () => {{
                window.removeEventListener('popstate', trackPageView);
            }};
        }}, []);
        
        return null; // This component doesn't render anything
    }};

    export default TrackingComponent;
    """
    
    return Response(content=component, media_type="application/javascript")

@router.post("/tracking/track")
async def track_page_view(request: Request):
    """Endpoint to receive tracking data"""
    try:
        print("Received tracking request") # Server-side debug log
        
        # Initialize tracking service
        await tracking_service.initialize()
        
        data = await request.json()
        print(f"Tracking data: {data}") # Server-side debug log
        
        # Get client IP
        ip = request.client.host
        
        # Create tracking data
        tracking_data = {
            "ip_address": ip,
            "page_url": data.get("url"),
            "page_title": data.get("title"),
            "user_agent": data.get("userAgent"),
            "referrer": data.get("referrer"),
            "language": data.get("language"),
            "screen_resolution": f"{data.get('screenWidth')}x{data.get('screenHeight')}",
            "timestamp": datetime.utcnow()
        }
        
        # Store in MongoDB
        await tracking_service.collection.insert_one(tracking_data)
        print("Tracking data stored successfully") # Server-side debug log
        
        return format_response(message="Tracking data received successfully")
    except Exception as e:
        print(f"Tracking error: {str(e)}") # Server-side debug log
        return format_response(message=str(e), status=False) 