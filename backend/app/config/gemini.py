import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Gemini Configuration
# Gemini Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL_NAME")  # or "gemini-pro-vision" if you need vision capabilities