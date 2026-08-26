# Advanced Cricket Analytics Dashboard — Render/Vercel Ready

## Render fix

The previous deployment successfully built all Python packages. It failed only because Render was configured to start:

`WI_Vs_SL_first_test_full_match_report.wsgi`

That is not the application entry point.

Use:

**Root Directory:** `backend`

**Build Command:** `pip install -r requirements.txt`

**Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Health Check Path:** `/api/health`

The included `render.yaml` already contains these settings.

## Vercel

Set Vercel Root Directory to `frontend`.
Build command: `npm run build`
Output directory: `dist`

After Render is live, add environment variable:
`VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com`
