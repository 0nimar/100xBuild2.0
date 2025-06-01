from fastapi import APIRouter, Request, Response, HTTPException
from app.services.tracking import tracking_service
from app.services.geolocation import geolocation_service
from app.utils.helpers import format_response
import json
from datetime import datetime
import uuid
from typing import List, Dict, Any
from bson import ObjectId
from urllib.parse import urlparse

router = APIRouter()