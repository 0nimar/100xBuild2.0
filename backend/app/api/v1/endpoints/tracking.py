from fastapi import APIRouter, Request, Response, HTTPException
from app.services.tracking import tracking_service
from app.utils.helpers import format_response
import json
from datetime import datetime
import uuid
from typing import List, Dict, Any
from bson import ObjectId

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
        const TRACKING_ENDPOINT = 'https://d66d-2409-408c-9091-6729-b91e-77b0-fd5e-e44d.ngrok-free.app/api/v1/tracking/track';
        const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
        const PAGE_CHANGE_INTERVAL = 1000; // Check for page changes every second
        let sessionId = localStorage.getItem('tracking_session_id') || null;
        let lastActivity = Date.now();
        let sessionStartTime = Date.now();
        let lastPageUrl = window.location.href;
        let pageStartTime = Date.now();
        let pageViewCount = 0;
        
        // Function to detect device type
        function getDeviceType() {
            const ua = navigator.userAgent;
            if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
                return "tablet";
            }
            if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
                return "mobile";
            }
            return "desktop";
        }

        // Function to detect browser
        function getBrowser() {
            const ua = navigator.userAgent;
            let browser = "Unknown";
            
            if (ua.includes("Firefox")) browser = "Firefox";
            else if (ua.includes("Chrome")) browser = "Chrome";
            else if (ua.includes("Safari")) browser = "Safari";
            else if (ua.includes("Edge")) browser = "Edge";
            else if (ua.includes("MSIE") || ua.includes("Trident/")) browser = "Internet Explorer";
            else if (ua.includes("Opera")) browser = "Opera";
            
            return browser;
        }

        // Function to detect OS
        function getOS() {
            const ua = navigator.userAgent;
            let os = "Unknown";
            
            if (ua.includes("Windows")) os = "Windows";
            else if (ua.includes("Mac")) os = "MacOS";
            else if (ua.includes("Linux")) os = "Linux";
            else if (ua.includes("Android")) os = "Android";
            else if (ua.includes("iOS")) os = "iOS";
            
            return os;
        }
        
        // Function to get current page data
        function getPageData() {
            const url = new URL(window.location.href);
            const currentTime = Date.now();
            const pageDuration = (currentTime - pageStartTime) / 1000; // in seconds
            
            const data = {
                domain: url.hostname,
                page_path: url.pathname + url.search + url.hash,
                title: document.title,
                userAgent: navigator.userAgent,
                deviceType: getDeviceType(),
                deviceBrowser: getBrowser(),
                deviceOS: getOS(),
                referrer: document.referrer,
                language: navigator.language,
                screenWidth: window.screen.width,
                screenHeight: window.screen.height,
                sessionId: sessionId,
                sessionStartTime: sessionStartTime,
                currentTime: currentTime,
                pageStartTime: pageStartTime,
                pageDuration: pageDuration,
                pageViewCount: pageViewCount,
                isPageChange: window.location.href !== lastPageUrl
            };
            console.log('Page data:', data); // Debug log
            return data;
        }
        
        // Function to send tracking data
        function trackPageView(isSessionEnd = false, isPageChange = false) {
            console.log('Attempting to track page view...'); // Debug log
            const data = getPageData();
            data.isSessionEnd = isSessionEnd;
            data.isPageChange = isPageChange;
            
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
                if (data.sessionId && !sessionId) {
                    sessionId = data.sessionId;
                    localStorage.setItem('tracking_session_id', sessionId);
                }
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

        // Function to check session timeout
        function checkSessionTimeout() {
            const now = Date.now();
            if (now - lastActivity > SESSION_TIMEOUT) {
                // Session timed out
                trackPageView(true, false);
                sessionId = null;
                localStorage.removeItem('tracking_session_id');
                sessionStartTime = now;
            }
        }

        // Function to check for page changes
        function checkPageChange() {
            if (window.location.href !== lastPageUrl) {
                // Page has changed
                trackPageView(false, true);
                lastPageUrl = window.location.href;
                pageStartTime = Date.now();
                pageViewCount++;
            }
        }
        
        // Update last activity time on user interaction
        function updateLastActivity() {
            lastActivity = Date.now();
        }
        
        // Add event listeners for user activity
        ['click', 'scroll', 'keypress', 'mousemove'].forEach(event => {
            document.addEventListener(event, updateLastActivity);
        });
        
        // Check session timeout every minute
        setInterval(checkSessionTimeout, 60000);
        
        // Check for page changes every second
        setInterval(checkPageChange, PAGE_CHANGE_INTERVAL);
        
        // Track initial page view
        console.log('Tracking initial page view...'); // Debug log
        pageViewCount++;
        trackPageView(false, true);
        
        // Track when user leaves the page
        window.addEventListener('beforeunload', () => {
            console.log('User leaving page, tracking...'); // Debug log
            trackPageView(true, false);
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
        
        # Get IP directly from X-Forwarded-For header
        ip = request.headers.get("X-Forwarded-For", "0.0.0.0")
        # If there are multiple IPs, take the first one
        if "," in ip:
            ip = ip.split(",")[0].strip()
            
        print(f"Using IP from X-Forwarded-For: {ip}")
        
        # Handle session
        session_id = data.get("sessionId")
        is_session_end = data.get("isSessionEnd", False)
        is_page_change = data.get("isPageChange", False)
        
        if not session_id:
            session_id = str(uuid.uuid4())
        
        # Create tracking data
        tracking_data = {
            "ip_address": ip,
            "domain": data.get("domain"),
            "page_path": data.get("page_path"),
            "page_title": data.get("title"),
            "user_agent": data.get("userAgent"),
            "device_type": data.get("deviceType"),
            "device_browser": data.get("deviceBrowser"),
            "device_os": data.get("deviceOS"),
            "referrer": data.get("referrer"),
            "language": data.get("language"),
            "screen_resolution": f"{data.get('screenWidth')}x{data.get('screenHeight')}",
            "timestamp": datetime.utcnow(),
            "session_id": session_id,
            "session_start": datetime.fromtimestamp(data.get("sessionStartTime") / 1000),
            "is_session_end": is_session_end,
            "is_page_change": is_page_change,
            "page_duration": data.get("pageDuration"),
            "page_view_count": data.get("pageViewCount")
        }
        
        if is_session_end:
            tracking_data["session_end"] = datetime.fromtimestamp(data.get("currentTime") / 1000)
            tracking_data["session_duration"] = (tracking_data["session_end"] - tracking_data["session_start"]).total_seconds()
        
        # Store in MongoDB
        await tracking_service.collection.insert_one(tracking_data)
        print("Tracking data stored successfully") # Server-side debug log
        
        return format_response(
            message="Tracking data received successfully",
            data={"sessionId": session_id}
        )
    except Exception as e:
        print(f"Tracking error: {str(e)}") # Server-side debug log
        return format_response(message=str(e), status=False)

@router.get("/tracking/domains")
async def get_unique_domains():
    """Get all unique domains from the tracking data"""
    try:
        # Initialize tracking service
        await tracking_service.initialize()
        
        # Get unique domains using MongoDB aggregation
        pipeline = [
            {"$group": {"_id": "$domain"}},
            {"$sort": {"_id": 1}}
        ]
        
        domains = await tracking_service.collection.aggregate(pipeline).to_list(None)
        
        # Extract domain names from the result
        domain_list = [doc["_id"] for doc in domains if doc["_id"]]
        
        return format_response(
            message="Domains retrieved successfully",
            data={"domains": domain_list}
        )
    except Exception as e:
        
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tracking/domain/{domain}")
async def get_domain_analytics(domain: str):
    """Get detailed analytics for a specific domain"""
    try:
        # Initialize tracking service
        await tracking_service.initialize()
        
        # Get all tracking data for the domain
        domain_data = await tracking_service.collection.find({"domain": domain}).to_list(None)
        
        if not domain_data:
            raise HTTPException(status_code=404, detail=f"No data found for domain: {domain}")
        
        # Calculate various metrics
        analytics = {
            "domain": domain,
            "total_page_views": len(domain_data),
            "unique_visitors": len(set(doc["ip_address"] for doc in domain_data)),
            "unique_sessions": len(set(doc["session_id"] for doc in domain_data)),
            "devices": {
                "mobile": len([doc for doc in domain_data if doc["device_type"] == "mobile"]),
                "tablet": len([doc for doc in domain_data if doc["device_type"] == "tablet"]),
                "desktop": len([doc for doc in domain_data if doc["device_type"] == "desktop"])
            },
            "browsers": {},
            "operating_systems": {},
            "screen_resolutions": {},
            "pages": {},
            "average_session_duration": 0,
            "total_sessions": 0
        }
        
        # Calculate browser and OS distribution
        for doc in domain_data:
            # Browser stats
            browser = doc.get("device_browser", "Unknown")
            analytics["browsers"][browser] = analytics["browsers"].get(browser, 0) + 1
            
            # OS stats
            os = doc.get("device_os", "Unknown")
            analytics["operating_systems"][os] = analytics["operating_systems"].get(os, 0) + 1
            
            # Screen resolution stats
            resolution = doc.get("screen_resolution", "Unknown")
            analytics["screen_resolutions"][resolution] = analytics["screen_resolutions"].get(resolution, 0) + 1
            
            # Page stats
            page = doc.get("page_path", "Unknown")
            analytics["pages"][page] = analytics["pages"].get(page, 0) + 1
            
            # Session duration stats
            if doc.get("session_duration"):
                analytics["total_sessions"] += 1
                analytics["average_session_duration"] += doc["session_duration"]
        
        # Calculate average session duration
        if analytics["total_sessions"] > 0:
            analytics["average_session_duration"] = round(
                analytics["average_session_duration"] / analytics["total_sessions"], 
                2
            )
        
        # Sort pages by views
        analytics["pages"] = dict(sorted(
            analytics["pages"].items(), 
            key=lambda x: x[1], 
            reverse=True
        ))
        
        # Get most recent activity
        latest_activity = max(doc["timestamp"] for doc in domain_data)
        analytics["latest_activity"] = latest_activity
        
        return format_response(
            message=f"Analytics retrieved successfully for domain: {domain}",
            data=analytics
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        print(e)    
        raise HTTPException(status_code=500, detail=str(e)) 