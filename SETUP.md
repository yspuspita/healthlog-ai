# HealthLog AI - Setup Guide

## Quick Start

### 1. Setup Gemini API Key

Edit `backend/.env` and replace the placeholder:

```bash
GEMINI_API_KEY=your_real_gemini_api_key_here
CORS_ORIGINS=http://localhost:5173
PORT=8000
```

Get your free API key at: https://aistudio.google.com/app/apikey

### 2. Start the Application

```bash
./start.sh
```

Or manually:

**Terminal 1 - Backend:**
```bash
cd backend
source .venv/bin/activate
python3 main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 3. Access the App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## What's Built

### Backend (FastAPI + LangGraph)
- ✅ SQLite database with health_logs, reports, chat_sessions tables
- ✅ Gemini 2.0 Flash AI integration via LangGraph
- ✅ 4 specialized prompts (Chat, Analysis, Reports, Quick Insights)
- ✅ Stateful chat agent with memory
- ✅ All 11 API endpoints fully functional
- ✅ CORS configured for local development
- ✅ Railway deployment ready (`railway.toml`, `Procfile`)

### Frontend (React + Vite + Tailwind)
- ✅ Full design system implementation (colors, typography, components)
- ✅ Responsive layout with sidebar navigation
- ✅ Dashboard with stats cards and AI insights
- ✅ Log Today form with sliders and inputs
- ✅ Chat interface with streaming-style UI
- ✅ Axios API client with all endpoints
- ✅ Vercel deployment ready (`vercel.json`)

---

## Testing Checklist

Before deployment, test these flows:

### 1. Save a Log Entry
- Go to "Catat Hari Ini"
- Fill mood, energy, sleep, etc.
- Click "Simpan Catatan"
- Should see "✓ Tersimpan!" confirmation

### 2. View Dashboard
- Go to Dashboard
- Should see stats cards with averages
- Should see AI quick insight (if API key is set)

### 3. Chat with AI
- Go to "Tanya AI"
- Send message: "Bagaimana kondisi saya?"
- AI should respond with insights based on your data
- Test Clear button

### 4. Backend API
Open http://localhost:8000/docs and test:
- POST /api/logs (save log)
- GET /api/stats?days=7
- POST /api/chat

---

## Deployment

### Backend (Railway)

1. Create new Railway project
2. Connect GitHub repo
3. Set Root Directory: `backend`
4. Add environment variable: `GEMINI_API_KEY`
5. Deploy automatically uses `railway.toml`

Railway will run: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel)

1. Import GitHub repo to Vercel
2. Set Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-railway-app.railway.app`

Vercel will auto-detect Vite and deploy.

---

## File Structure

```
healthlog-ai/
├── backend/
│   ├── .env                 # API keys (DO NOT COMMIT)
│   ├── .env.example         # Template
│   ├── database.py          # SQLite operations
│   ├── prompts.py           # AI prompts
│   ├── agent.py             # LangGraph agent
│   ├── main.py              # FastAPI app
│   ├── requirements.txt     # Python dependencies
│   ├── Procfile             # Railway start command
│   └── railway.toml         # Railway config
│
├── frontend/
│   ├── src/
│   │   ├── api/client.js       # Axios API client
│   │   ├── components/
│   │   │   └── layout/Layout.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LogToday.jsx
│   │   │   └── Chat.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env                 # API URL
│   ├── tailwind.config.js   # Design tokens
│   ├── vite.config.js
│   ├── vercel.json          # Vercel config
│   └── package.json
│
├── start.sh                 # Quick start script
├── README.md
└── SETUP.md                 # This file
```

---

## Troubleshooting

### Backend won't start
- Check if port 8000 is available: `lsof -i :8000`
- Verify GEMINI_API_KEY is set in `.env`
- Ensure venv is activated: `source .venv/bin/activate`

### Frontend build errors
- Run `npm install` again
- Clear cache: `rm -rf node_modules && npm install`

### CORS errors
- Check `CORS_ORIGINS` in `backend/.env` includes frontend URL
- Restart backend after changing `.env`

### AI not responding
- Verify GEMINI_API_KEY is valid
- Check backend logs for errors
- Try the chat endpoint directly: http://localhost:8000/docs

---

## Next Steps (Optional Enhancements)

The core MVP is complete! If you want to extend it:

- [ ] Add History page with Recharts graphs
- [ ] Add Analyze page with pattern detection
- [ ] Add Report page for doctor reports
- [ ] Add export to CSV/PDF
- [ ] Add user authentication
- [ ] Add mobile responsive optimizations
- [ ] Add dark mode support
- [ ] Add push notifications/reminders

---

Yesi Puspita
