# FastAPI Template

This is a template FastAPI application with a structured project layout.

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       └── endpoints/
│   ├── core/
│   ├── db/
│   ├── models/
│   └── schemas/
├── requirements.txt
└── main.py
```

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file based on `.env.example` and update the values.

## Running the Application

To run the application in development mode:

```bash
uvicorn main:app --reload
```

The API will be available at `https://one00xbuild2-0.onrender.com`

API documentation will be available at:
- Swagger UI: `https://one00xbuild2-0.onrender.com/docs`
- ReDoc: `https://one00xbuild2-0.onrender.com/redoc` 