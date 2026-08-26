
# Advanced Cricket Analytics Dashboard

A production-style starter for an interactive cricket performance platform.

## Included

- React + Vite dashboard
- FastAPI backend
- Interactive Recharts visualizations
- Day / session / innings / team / player filters
- Batting, bowling, partnership and wicket views
- Team comparison and analyst ratings
- Excel / CSV upload endpoint
- PDF export
- PowerPoint export
- Render + Vercel deployment structure
- Initial dataset based on the uploaded West Indies vs Sri Lanka 1st Test report

## Run locally

### Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Production

Frontend:
- Deploy `frontend/` to Vercel.
- Set `VITE_API_URL` to your Render backend URL.

Backend:
- Deploy `backend/` to Render.
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## Next upgrade

For true ball-by-ball analytics, add a raw delivery table and ingest a ball-by-ball source. That enables wagon wheels, shot zones, phase strike rate, matchup analysis, over-by-over momentum and DRS/video-linked events.
