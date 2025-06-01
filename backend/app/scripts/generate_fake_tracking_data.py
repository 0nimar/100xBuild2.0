import json
from datetime import datetime, timedelta
import random
import uuid
from typing import List, Dict, Any

# Constants for generating realistic data
DOMAINS = ["test-site.com"]
PAGE_PATHS = [
    "/", "/about", "/products", "/contact", "/blog", 
    "/services", "/pricing", "/faq", "/team", "/careers",
    "/privacy", "/terms", "/login", "/register", "/dashboard"
]
DEVICE_TYPES = ["desktop", "mobile", "tablet"]
BROWSERS = ["Chrome", "Firefox", "Safari", "Edge", "Opera"]
OPERATING_SYSTEMS = ["Windows", "MacOS", "Linux", "Android", "iOS"]
COUNTRIES = ["United States", "United Kingdom", "Canada", "Germany", "France", "Japan", "Australia"]
CITIES = {
    "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
    "United Kingdom": ["London", "Manchester", "Birmingham", "Glasgow", "Liverpool"],
    "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
    "Germany": ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
    "France": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"],
    "Japan": ["Tokyo", "Osaka", "Nagoya", "Sapporo", "Fukuoka"],
    "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"]
}
SCREEN_RESOLUTIONS = [
    "1920x1080", "1366x768", "1536x864", "1440x900", "1280x720",
    "375x812", "414x896", "360x740", "412x915", "390x844"
]
REFERRERS = [
    "google.com", "facebook.com", "twitter.com", "linkedin.com", "reddit.com",
    "github.com", "medium.com", "youtube.com", "instagram.com", "pinterest.com"
]

# Anomaly patterns
ANOMALY_PATTERNS = {
    "bot_like": {
        "page_duration": (1, 3),  # Very short page durations
        "session_duration": (10, 30),  # Very short sessions
        "pages_per_session": (20, 50),  # Many pages per session
        "frequency": 0.05  # 5% chance
    },
    "power_user": {
        "page_duration": (600, 1800),  # Very long page durations
        "session_duration": (7200, 14400),  # Very long sessions
        "pages_per_session": (15, 30),  # Many pages
        "frequency": 0.03  # 3% chance
    },
    "bounce": {
        "page_duration": (1, 5),  # Very short duration
        "session_duration": (1, 10),  # Very short session
        "pages_per_session": (1, 1),  # Only one page
        "frequency": 0.15  # 15% chance
    },
    "time_anomaly": {
        "time_offset": (-24, 24),  # Hours offset from current time
        "frequency": 0.02  # 2% chance
    }
}

def generate_anomaly_session() -> Dict[str, Any]:
    """Generate an anomalous session pattern."""
    anomaly_type = random.choices(
        list(ANOMALY_PATTERNS.keys()),
        weights=[p["frequency"] for p in ANOMALY_PATTERNS.values()]
    )[0]
    return ANOMALY_PATTERNS[anomaly_type]

def generate_session_data(num_sessions: int = 100) -> List[Dict[str, Any]]:
    """Generate fake tracking data for multiple sessions."""
    all_tracking_data = []
    
    # Get current time as base
    current_time = datetime.now()
    
    for _ in range(num_sessions):
        # Determine if this session should be anomalous
        is_anomaly = random.random() < 0.25  # 25% chance of anomaly
        anomaly_pattern = generate_anomaly_session() if is_anomaly else None
        
        # Generate session metadata
        session_id = str(uuid.uuid4())
        domain = random.choice(DOMAINS)
        
        # Handle time anomalies
        if anomaly_pattern and "time_offset" in anomaly_pattern:
            time_offset = random.randint(*anomaly_pattern["time_offset"])
            session_start = current_time + timedelta(hours=time_offset)
        else:
            # Generate dates within the last 30 days
            days_ago = random.randint(0, 30)
            session_start = current_time - timedelta(days=days_ago)
        
        # Handle session duration anomalies
        if anomaly_pattern and "session_duration" in anomaly_pattern:
            session_duration = random.randint(*anomaly_pattern["session_duration"])
        else:
            session_duration = random.randint(60, 3600)  # 1 minute to 1 hour
        
        session_end = session_start + timedelta(seconds=session_duration)
        
        # Handle pages per session anomalies
        if anomaly_pattern and "pages_per_session" in anomaly_pattern:
            num_page_views = random.randint(*anomaly_pattern["pages_per_session"])
        else:
            num_page_views = random.randint(1, 10)
        
        # Generate page views for this session
        for i in range(num_page_views):
            # Calculate timestamp for this page view
            page_timestamp = session_start + timedelta(seconds=random.randint(0, session_duration))
            
            # Handle page duration anomalies
            if anomaly_pattern and "page_duration" in anomaly_pattern:
                page_duration = random.randint(*anomaly_pattern["page_duration"])
            else:
                page_duration = random.randint(10, 300)  # 10 seconds to 5 minutes
            
            # Generate page view data
            tracking_data = {
                "ip_address": f"192.168.{random.randint(1, 255)}.{random.randint(1, 255)}",
                "country": random.choice(COUNTRIES),
                "city": random.choice(CITIES[random.choice(COUNTRIES)]),
                "domain": domain,
                "page_path": random.choice(PAGE_PATHS),
                "page_title": f"Page {random.randint(1, 100)}",
                "user_agent": f"Mozilla/5.0 ({random.choice(OPERATING_SYSTEMS)}) {random.choice(BROWSERS)}",
                "device_type": random.choice(DEVICE_TYPES),
                "device_browser": random.choice(BROWSERS),
                "device_os": random.choice(OPERATING_SYSTEMS),
                "referrer": random.choice(REFERRERS),
                "language": random.choice(["en-US", "en-GB", "fr-FR", "de-DE", "es-ES"]),
                "screen_resolution": random.choice(SCREEN_RESOLUTIONS),
                "timestamp": page_timestamp,
                "session_id": session_id,
                "session_start": session_start,
                "is_session_end": i == num_page_views - 1,
                "is_page_change": i > 0,
                "page_duration": page_duration,
                "page_view_count": i + 1,
                "is_anomaly": is_anomaly
            }
            
            # Add session end data for the last page view
            if i == num_page_views - 1:
                tracking_data["session_end"] = session_end
                tracking_data["session_duration"] = session_duration
            
            all_tracking_data.append(tracking_data)
    
    return all_tracking_data

def main():
    # Generate 500 sessions worth of data
    fake_data = generate_session_data(50)
    
    # Save to JSON file
    output_file = "fake_tracking_data.json"
    with open(output_file, "w") as f:
        json.dump(fake_data, f, indent=2, default=str)  # Use str for datetime serialization
    
    print(f"Generated {len(fake_data)} fake tracking records and saved to {output_file}")

if __name__ == "__main__":
    main() 