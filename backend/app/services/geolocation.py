import geoip2.database
import geoip2.webservice
import requests
import os
from pathlib import Path
from fastapi import HTTPException

class GeolocationService:
    def __init__(self):
        self.db_path = Path("backend/app/data/GeoLite2-City.mmdb")
        self.reader = None
        
    async def initialize(self):
        """Initialize the GeoIP2 database"""
        try:
            if not self.db_path.exists():
                # Ensure the directory exists
                self.db_path.parent.mkdir(parents=True, exist_ok=True)
                
                # For development/testing, use a free IP geolocation service
                self.reader = None
            else:
                self.reader = geoip2.database.Reader(str(self.db_path))
        except Exception as e:
            print(f"Failed to initialize geolocation service: {e}")
            self.reader = None

    async def get_location(self, ip: str) -> dict:
        """Get location information from IP address"""
        try:
            # If we have the GeoIP2 database
            if self.reader:
                response = self.reader.city(ip)
                return {
                    "country": response.country.name,
                    "city": response.city.name
                }
            
            # Fallback to free IP geolocation service for development
            response = requests.get(f"https://ipapi.co/{ip}/json/")
            if response.status_code == 200:
                data = response.json()
                return {
                    "country": data.get("country_name", "Unknown"),
                    "city": data.get("city", "Unknown")
                }
            
            return {"country": "Unknown", "city": "Unknown"}
            
        except Exception as e:
            print(f"Geolocation error for IP {ip}: {e}")
            return {"country": "Unknown", "city": "Unknown"}

geolocation_service = GeolocationService() 