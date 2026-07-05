# MASTER PROMPT — HealthLog AI Autonomous Build
**Untuk:** Claude Code (claude-code CLI atau Cursor AI)  
**Mode:** Fully autonomous — jalankan terus sampai selesai, perbaiki error sendiri

---

## INSTRUKSI UTAMA

Kamu adalah senior full-stack engineer yang bertugas membangun **HealthLog AI** dari nol sampai deploy, secara otomatis dan tanpa intervensi manusia.

Baca semua dokumen berikut sebelum menulis satu baris kode pun:
- `PRD.md` → apa yang harus dibangun
- `Guideline.md` → bagaimana tampilannya
- `StyleGuide.md` → design tokens, komponen, warna
- `Tasks.md` → breakdown task per phase

---

## PRINSIP KERJA

### 1. Selalu Baca Dulu, Baru Tulis
Sebelum membuat file apapun, baca dokumen yang relevan. Jangan assume.

### 2. Test Setelah Setiap Phase
Setelah setiap phase selesai, jalankan test otomatis. Jika ada error, **debug dan perbaiki sendiri** tanpa berhenti meminta input user.

### 3. Error Handling
Jika terjadi error:
1. Baca error message dengan cermat
2. Identifikasi root cause
3. Perbaiki
4. Jalankan ulang
5. Ulangi sampai berjalan
Jangan menyerah setelah 1 kali error. Coba minimal 3 pendekatan berbeda.

### 4. Urutan Eksekusi
Ikuti urutan phase di Tasks.md **secara ketat**. Jangan loncat phase.

### 5. Commit After Each Phase
Setelah setiap phase selesai dan test pass, buat git commit dengan pesan yang deskriptif.

---

## EXECUTION PLAN

### STEP 1: Setup & Read Docs
```bash
# Pastikan semua docs ada
ls -la PRD.md Guideline.md StyleGuide.md Tasks.md

# Buat struktur direktori
mkdir -p healthlog-ai/backend healthlog-ai/frontend
cd healthlog-ai
git init
```

### STEP 2: Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

pip install fastapi "uvicorn[standard]" langchain langchain-google-genai \
    langgraph google-generativeai pandas python-dotenv sqlalchemy \
    langchain-community

pip freeze > requirements.txt
```

**Buat `.env` dari environment:**
```bash
# Baca GEMINI_API_KEY dari environment atau tanya user sekali
# JANGAN hardcode API key di kode
cat > .env << 'EOF'
GEMINI_API_KEY=PLACEHOLDER_REPLACE_WITH_REAL_KEY
CORS_ORIGINS=http://localhost:5173
PORT=8000
EOF
```

**Tulis file backend secara berurutan:**
1. `database.py` (sesuai T1.1)
2. `prompts.py` (sesuai T1.2)
3. `agent.py` (sesuai T1.3)
4. `main.py` (sesuai T1.4)

**Test backend:**
```bash
# Test 1: Import modules
python -c "from database import init_db; init_db(); print('DB OK')"

# Test 2: Start server
uvicorn main:app --reload &
sleep 3

# Test 3: Health check
curl -s http://localhost:8000/health | python -m json.tool

# Test 4: Save a log
curl -s -X POST http://localhost:8000/api/logs \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-01-01","mood":7,"energy":6,"sleep_hours":7.5,"stress_level":4}' \
  | python -m json.tool

# Test 5: Get logs
curl -s "http://localhost:8000/api/logs?days=7" | python -m json.tool

# Test 6: Get stats
curl -s "http://localhost:8000/api/stats?days=7" | python -m json.tool

echo "All backend tests passed!"
```

Jika **Test 3-6 semua return valid JSON**, backend phase selesai.  
Jika ada error, debug dan perbaiki sebelum lanjut.

### STEP 3: Frontend Setup
```bash
cd ../frontend
npm create vite@latest . -- --template react --yes
npm install
npm install tailwindcss @tailwindcss/vite axios react-router-dom recharts lucide-react
npm install -D autoprefixer
```

**Setup Tailwind:**
```bash
# Buat tailwind.config.js sesuai StyleGuide.md
# Buat vite.config.js dengan tailwindcss plugin
# Update src/index.css dengan @import "tailwindcss"
```

**Buat `.env`:**
```bash
echo "VITE_API_URL=http://localhost:8000" > .env
```

**Test Tailwind:**
```bash
npm run build 2>&1
# Harus selesai tanpa error
```

### STEP 4: Tulis Semua Frontend Files

Tulis file dalam urutan ini (dependencies first):

**4a. Utils & Constants:**
- `src/utils/constants.js`
- `src/utils/formatters.js`

**4b. API Client:**
- `src/api/client.js`

**4c. Context:**
- `src/context/AppContext.jsx`

**4d. UI Primitives (src/components/ui/):**
- `Button.jsx`
- `Card.jsx`
- `Input.jsx`
- `Slider.jsx`
- `Badge.jsx`
- `Toast.jsx`
- `Skeleton.jsx`
- `Spinner.jsx`
- `EmptyState.jsx`

**4e. Layout (src/components/layout/):**
- `Sidebar.jsx`
- `MobileNav.jsx`
- `Layout.jsx`

**4f. Feature Components:**
- `src/components/dashboard/StatCard.jsx`
- `src/components/dashboard/MiniChart.jsx`
- `src/components/charts/MoodEnergyChart.jsx`
- `src/components/charts/SleepChart.jsx`
- `src/components/charts/StressChart.jsx`
- `src/components/charts/SymptomChart.jsx`
- `src/components/chat/ChatBubble.jsx`
- `src/components/chat/TypingIndicator.jsx`
- `src/components/chat/SuggestedQuestions.jsx`
- `src/components/log/SliderField.jsx`
- `src/components/log/SymptomSelector.jsx`
- `src/components/log/WaterSelector.jsx`

**4g. Pages:**
- `src/pages/Dashboard.jsx`
- `src/pages/LogToday.jsx`
- `src/pages/History.jsx`
- `src/pages/Chat.jsx`
- `src/pages/Analyze.jsx`
- `src/pages/Report.jsx`

**4h. App Entry:**
- `src/App.jsx` (Router + Layout + Routes)
- `src/main.jsx`

### STEP 5: Build Test
```bash
cd frontend
npm run build 2>&1

# Harus output:
# ✓ built in X.Xs
# Jika ada error TypeScript/import, perbaiki dan build ulang
```

### STEP 6: Integration Test (Full Stack)
```bash
# Terminal 1: Backend
cd backend && uvicorn main:app --reload --port 8000 &

# Terminal 2: Frontend dev
cd frontend && npm run dev &
sleep 5

echo "App running at http://localhost:5173"

# Automated checks:
# 1. Backend health
HEALTH=$(curl -s http://localhost:8000/health)
echo "Health: $HEALTH"

# 2. Frontend accessible
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173)
echo "Frontend HTTP: $HTTP_CODE"

# 3. CORS check (frontend origin → backend)
CORS=$(curl -s -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS http://localhost:8000/api/logs \
  -I | grep -i "access-control-allow-origin")
echo "CORS: $CORS"
```

### STEP 7: API Key Validation
```bash
# Baca key dari .env
source backend/.env

# Test Gemini API key validity
python3 -c "
import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv('backend/.env')
key = os.getenv('GEMINI_API_KEY')
if not key or key == 'PLACEHOLDER_REPLACE_WITH_REAL_KEY':
    print('ERROR: GEMINI_API_KEY belum diset di backend/.env')
    exit(1)
genai.configure(api_key=key)
model = genai.GenerativeModel('gemini-2.0-flash')
resp = model.generate_content('Say: API key valid')
print('Gemini API: OK -', resp.text[:30])
"
```

Jika API key belum diset, **berhenti dan minta user input API key** — ini satu-satunya hal yang boleh meminta input user.

### STEP 8: End-to-End Feature Test
```bash
# Jalankan setelah backend dan frontend running

# Test 1: Save log via API
LOG_RESULT=$(curl -s -X POST http://localhost:8000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-01-15",
    "mood": 8,
    "energy": 7,
    "sleep_hours": 7.5,
    "sleep_quality": 8,
    "stress_level": 3,
    "water_ml": 2000,
    "exercise_type": "Jogging",
    "exercise_mins": 30
  }')
echo "Save log: $LOG_RESULT"

# Test 2: Get stats
STATS=$(curl -s "http://localhost:8000/api/stats?days=7")
echo "Stats: $STATS"

# Test 3: Chat (requires valid API key)
CHAT=$(curl -s -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Bagaimana kondisi saya?", "thread_id": "test-001"}')
echo "Chat: $CHAT"

# Test 4: Analyze
ANALYZE=$(curl -s -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"days": 7}')
echo "Analyze: $(echo $ANALYZE | python -m json.tool | head -5)"
```

### STEP 9: Deployment Files

**Backend (Railway):**
```bash
cat > backend/railway.toml << 'EOF'
[build]
builder = "nixpacks"

[deploy]
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
healthcheckTimeout = 30
restartPolicyType = "on_failure"
EOF

cat > backend/Procfile << 'EOF'
web: uvicorn main:app --host 0.0.0.0 --port $PORT
EOF

# Pastikan requirements.txt up to date
cd backend && pip freeze > requirements.txt
```

**Frontend (Vercel):**
```bash
cat > frontend/vercel.json << 'EOF'
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
EOF
```

### STEP 10: Final Validation

```bash
# Build frontend untuk production
cd frontend && npm run build

# Check build output
ls -la dist/

# Validate no console errors (servis static)
npx serve dist -p 4173 &
sleep 2
HTTP=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4173)
echo "Production build HTTP: $HTTP"  # Harus 200

# Generate sample data untuk demo
cd backend && python -c "
from database import init_db, save_log
from datetime import datetime, timedelta
import random
init_db()
for i in range(14):
    d = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
    save_log({
        'date': d,
        'mood': random.randint(5,9),
        'energy': random.randint(5,9),
        'sleep_hours': round(random.uniform(5.5,8.5), 1),
        'sleep_quality': random.randint(5,9),
        'stress_level': random.randint(2,7),
        'water_ml': random.randint(1500,2500),
        'exercise_type': random.choice(['Jogging','Yoga',None]),
        'exercise_mins': random.randint(20,45),
    })
print('Sample data generated: 14 hari')
"

echo ""
echo "=============================="
echo "  HealthLog AI — BUILD DONE  "
echo "=============================="
echo ""
echo "Backend : http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "Docs API: http://localhost:8000/docs"
echo ""
echo "Langkah deploy:"
echo "1. Push ke GitHub"
echo "2. Railway: connect repo/backend, set GEMINI_API_KEY"
echo "3. Vercel: connect repo/frontend, set VITE_API_URL"
```

---

## ERROR PLAYBOOK

Gunakan playbook ini ketika terjadi error:

| Error | Kemungkinan Penyebab | Solusi |
|-------|---------------------|--------|
| `ModuleNotFoundError` | Package belum install | `pip install <package>` |
| `CORS error` | Origin tidak di-allow | Tambahkan origin ke `CORS_ORIGINS` env |
| `Cannot find module` | Import path salah | Cek path relatif, gunakan alias jika perlu |
| `404 Not Found` (API) | Endpoint belum dibuat | Cek routing di main.py |
| `422 Unprocessable Entity` | Request body tidak sesuai schema | Cek Pydantic model |
| `sqlite3.IntegrityError` | UNIQUE constraint | Gunakan INSERT OR REPLACE |
| `langchain` import error | Version incompatible | Cek `requirements.txt`, pin versi |
| `Vite build error` | JSX syntax error | Cek file terakhir yang diedit |
| `Tailwind class tidak muncul` | Class tidak di-scan | Tambahkan path ke `content` di tailwind.config |
| `Recharts tidak responsive` | Tidak pakai ResponsiveContainer | Wrap chart dengan `<ResponsiveContainer width="100%" height={350}>` |

---

## KODE WAJIB — JANGAN DILEWATI

### Environment Loading (backend/main.py)
```python
from dotenv import load_dotenv
load_dotenv()  # WAJIB di baris pertama setelah imports
import os
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY tidak ditemukan di .env")
```

### API Client Base URL (frontend/src/api/client.js)
```js
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 60000, // 60 detik untuk AI responses
});
export default api;
```

### Router Setup (frontend/src/App.jsx)
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
// ... semua pages
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="log" element={<LogToday />} />
          <Route path="history" element={<History />} />
          <Route path="chat" element={<Chat />} />
          <Route path="analyze" element={<Analyze />} />
          <Route path="report" element={<Report />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### CORS Middleware (backend/main.py)
```python
from fastapi.middleware.cors import CORSMiddleware
import os
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## ACCEPTANCE CRITERIA (Project Selesai Jika)

- [ ] `GET /health` → `{"status": "ok"}`
- [ ] Dashboard tampil dengan stats cards dan mini chart
- [ ] Form log berhasil save ke SQLite
- [ ] History menampilkan chart yang benar
- [ ] Chat AI merespons dalam bahasa Indonesia
- [ ] Analyze menghasilkan analisis pola yang coherent
- [ ] Report generate laporan terstruktur
- [ ] Frontend `npm run build` sukses tanpa error
- [ ] CORS tidak error antara frontend dan backend
- [ ] Mobile responsive di 375px
- [ ] Semua warna sesuai palette (#FBEFEF, #FFE2E2, #F5CBCB, #C5B3D3)
- [ ] API key dibaca dari `.env`, tidak hardcoded

**Ketika semua criteria ini terpenuhi → project selesai.**
