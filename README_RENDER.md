# Render deployment

Use these exact Render settings:

Root Directory: `backend`
Build Command: `pip install -r requirements.txt`
Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
Health Check Path: `/api/health`

Do NOT use `WI_Vs_SL_first_test_full_match_report.wsgi`.
This is a FastAPI/ASGI application and must be started with Uvicorn.
