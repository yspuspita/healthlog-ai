# 💚 HealthLog AI

**Catat. Pahami. Jaga Kesehatanmu.**

Aplikasi jurnal kesehatan pribadi berbasis AI yang membantu kamu memahami pola kesehatan dan membuat keputusan yang lebih baik.

---

## ✨ Features

- 📝 **Daily Health Logging** - Catat mood, energi, tidur, stres, gejala, olahraga, hidrasi
- 📊 **Dashboard & Statistics** - Visualisasi data kesehatanmu dengan stats cards yang rapi
- 💬 **AI Chat Assistant** - Chat dengan AI yang punya konteks data kesehatanmu (Gemini 2.0 Flash)
- 🔍 **Pattern Detection** - Deteksi pola otomatis (e.g., "tidur kurang → mood turun")
- 📋 **Doctor Reports** - Generate laporan terstruktur untuk dokter
- 🎨 **Beautiful UI** - Design system yang tenang dan hangat (pastel colors)

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Gemini API Key (gratis di [aistudio.google.com](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Setup Backend
cd backend
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Setup Frontend
cd ../frontend
npm install

# Configure API Key
cd ../backend
cp .env.example .env
# Edit .env dan isi GEMINI_API_KEY kamu
```

### Run the App

**Option 1: Menggunakan start script (Mac/Linux)**
```bash
./start.sh
```

**Option 2: Manual (2 terminals)**

Terminal 1 - Backend:
```bash
cd backend
source .venv/bin/activate
python3 main.py
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Buka browser: **http://localhost:5173** 🎉

---

## 📁 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS + React Router + Axios |
| Backend | FastAPI (Python 3.11) + Uvicorn |
| AI Agent | LangGraph + Gemini 2.0 Flash |
| Database | SQLite (lokal, privasi by design) |
| Deployment | Vercel (Frontend) + Railway (Backend) |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/logs` | Save health log entry |
| GET | `/api/logs?days=30` | Get logs |
| GET | `/api/stats?days=7` | Get statistics summary |
| POST | `/api/chat` | Chat with AI |
| POST | `/api/analyze` | Pattern detection |
| POST | `/api/report` | Generate doctor report |

Full API docs: **http://localhost:8000/docs**

---

## 🚢 Deployment

### Backend → Railway

1. Push to GitHub
2. Create Railway project
3. Set Root Directory: `backend`
4. Add env: `GEMINI_API_KEY`
5. Auto-deploy from `railway.toml`

### Frontend → Vercel

1. Import GitHub repo
2. Set Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output: `dist`
5. Add env: `VITE_API_URL`

---

## 📄 License

MIT License

---

Yesi Puspita
