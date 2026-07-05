# Tasks — HealthLog AI
**Format:** [ ] Task · Context · Acceptance Criteria

---

## PHASE 0 — Project Setup

### T0.1 Init Monorepo Structure
```
healthlog-ai/
├── backend/          ← FastAPI
├── frontend/         ← React + Vite
├── .gitignore
└── README.md
```
- [ ] `mkdir healthlog-ai && cd healthlog-ai`
- [ ] `mkdir backend frontend`
- [ ] Buat `.gitignore` yang cover Python, Node, .env, __pycache__, dist, .venv
- [ ] Buat root `README.md` dengan instruksi setup singkat

### T0.2 Backend Init (FastAPI)
- [ ] `cd backend && python -m venv .venv`
- [ ] Aktifkan venv: `source .venv/bin/activate`
- [ ] Install: `pip install fastapi uvicorn[standard] langchain langchain-google-genai langgraph google-generativeai pandas python-dotenv sqlalchemy`
- [ ] Buat `requirements.txt` via `pip freeze > requirements.txt`
- [ ] Buat `.env` dari `.env.example`:
  ```
  GEMINI_API_KEY=your_key_here
  CORS_ORIGINS=http://localhost:5173
  PORT=8000
  ```
- [ ] Buat `.env.example` (tanpa value sensitif)
- [ ] Buat `backend/Procfile`: `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Buat `backend/railway.toml`:
  ```toml
  [build]
  builder = "nixpacks"
  [deploy]
  startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
  ```

### T0.3 Frontend Init (React + Vite)
- [ ] `cd frontend && npm create vite@latest . -- --template react`
- [ ] `npm install`
- [ ] `npm install tailwindcss @tailwindcss/vite`
- [ ] `npm install axios react-router-dom recharts lucide-react`
- [ ] `npm install -D @types/react`
- [ ] Setup Tailwind: buat `tailwind.config.js` sesuai StyleGuide.md
- [ ] Import Tailwind di `src/index.css`
- [ ] Import Inter font di `index.html`: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`
- [ ] Setup `VITE_API_URL` di `.env`: `VITE_API_URL=http://localhost:8000`
- [ ] Buat `frontend/.env.example`
- [ ] Buat `frontend/vercel.json`:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

---

## PHASE 1 — Backend Core

### T1.1 Database Module (`backend/database.py`)
- [ ] Import: `sqlite3`, `pandas`, `datetime`, `pathlib`
- [ ] Konstanta `DB_PATH = "healthlog.db"`
- [ ] Fungsi `init_db()`:
  - Buat tabel `health_logs` dengan 16 kolom (lihat PRD schema)
  - Constraint `UNIQUE` pada kolom `date`
  - Buat tabel `reports` (4 kolom)
  - Buat tabel `chat_sessions` (5 kolom)
  - Jalankan `CREATE TABLE IF NOT EXISTS`
- [ ] Fungsi `save_log(data: dict) -> bool`:
  - Gunakan `INSERT OR REPLACE INTO` (upsert berdasarkan date)
  - Return True jika sukses, False jika error
  - Wrap dalam try/except
- [ ] Fungsi `get_logs(days: int = 30) -> list[dict]`:
  - Query dengan `ORDER BY date DESC LIMIT ?`
  - Return list of dicts (bukan DataFrame, untuk JSON serializable)
- [ ] Fungsi `get_logs_for_ai(days: int = 30) -> str`:
  - Format data sebagai string yang kaya konteks untuk AI prompt
  - Include statistik rata-rata di akhir
  - Handle null values dengan graceful
- [ ] Fungsi `get_stats(days: int = 7) -> dict`:
  - Hitung avg mood, energy, sleep_hours, stress_level
  - Hitung total exercise_mins
  - Hitung count hari dengan gejala
  - Return dict yang siap di-serialize ke JSON
- [ ] Fungsi `save_report(content, period_start, period_end) -> int`:
  - Insert ke tabel reports
  - Return id record baru
- [ ] Fungsi `get_reports(limit: int = 10) -> list[dict]`:
  - Query terbaru di atas
- [ ] Fungsi `save_chat_message(thread_id, role, content)`:
  - Insert ke chat_sessions
- [ ] Fungsi `get_chat_history(thread_id: str, limit: int = 20) -> list[dict]`:
  - Query berdasarkan thread_id, ORDER BY created_at ASC
- [ ] Fungsi `clear_chat_history(thread_id: str)`:
  - DELETE WHERE thread_id = ?
- [ ] **Test:** Import module, panggil `init_db()`, pastikan file `healthlog.db` terbuat

### T1.2 Prompts Module (`backend/prompts.py`)
- [ ] Buat 4 prompt strings (identik dengan yang sudah dibuat di healthlog-docs):
  - `CHAT_SYSTEM_PROMPT` — parameter: `{health_data}`
  - `PATTERN_DETECTION_PROMPT` — parameter: `{health_data}`
  - `DOCTOR_REPORT_PROMPT` — parameter: `{period_start}`, `{period_end}`, `{health_data}`, `{today}`
  - `QUICK_INSIGHT_PROMPT` — parameter: `{health_data}`
- [ ] **Test:** Import, pastikan semua string bisa di-format dengan `.format()`

### T1.3 AI Agent Module (`backend/agent.py`)
- [ ] Import: `langchain_google_genai`, `langchain_core.messages`, `langgraph.graph`, `langgraph.checkpoint.memory`
- [ ] Define `HealthState(TypedDict)` dengan field `messages` dan `health_data`
- [ ] Fungsi `get_llm(api_key: str, temperature: float) -> ChatGoogleGenerativeAI`:
  - Model: `gemini-2.0-flash`
  - Wrap dalam try/except, raise ValueError jika API key invalid
- [ ] Fungsi `create_chat_agent(api_key: str) -> CompiledGraph`:
  - LLM temperature 0.3
  - MemorySaver sebagai checkpointer
  - StateGraph dengan node `health_assistant`
  - Node inject system prompt + health_data + invoke LLM
  - Compile dengan checkpointer
- [ ] Fungsi `run_chat(agent, message: str, thread_id: str, health_data: str) -> str`:
  - Invoke dengan config `{"configurable": {"thread_id": thread_id}}`
  - Return content dari last message
  - Handle exception, return error message string
- [ ] Fungsi `run_analysis(api_key: str, health_data: str) -> str`:
  - One-shot call, temperature 0.2
  - Gunakan `PATTERN_DETECTION_PROMPT`
- [ ] Fungsi `run_report(api_key: str, health_data: str, period_start: str, period_end: str) -> str`:
  - One-shot call, temperature 0.1
  - Gunakan `DOCTOR_REPORT_PROMPT`
- [ ] Fungsi `run_quick_insight(api_key: str, health_data: str) -> str`:
  - One-shot call, temperature 0.3
  - Gunakan `QUICK_INSIGHT_PROMPT`
- [ ] **Test:** Inisialisasi agent, kirim 1 pesan, pastikan ada response

### T1.4 Main FastAPI App (`backend/main.py`)
- [ ] Import semua module
- [ ] Load `.env` dengan `python-dotenv`
- [ ] Init FastAPI dengan title "HealthLog AI API"
- [ ] Setup CORS middleware:
  - `allow_origins`: dari env `CORS_ORIGINS` (split by comma)
  - `allow_methods`: `["*"]`
  - `allow_headers`: `["*"]`
- [ ] `init_db()` on startup (via `@app.on_event("startup")`)
- [ ] Inisialisasi agent global di startup (lazy — buat saat pertama request)
- [ ] **Endpoint GET `/health`:**
  - Return `{"status": "ok", "timestamp": datetime.now().isoformat()}`
- [ ] **Endpoint POST `/api/logs`:**
  - Request body: Pydantic model `HealthLogCreate` (semua field optional kecuali `date`)
  - Validasi: `date` harus format `YYYY-MM-DD`
  - Call `database.save_log(data.dict())`
  - Return `{"success": True, "date": date}`
- [ ] **Endpoint GET `/api/logs`:**
  - Query param: `days: int = 30` (max 90)
  - Return list of logs
- [ ] **Endpoint GET `/api/stats`:**
  - Query param: `days: int = 7`
  - Return stats dict
- [ ] **Endpoint POST `/api/chat`:**
  - Request body: `{"message": str, "thread_id": str}`
  - Ambil `GEMINI_API_KEY` dari env
  - Ambil `health_data` dari `database.get_logs_for_ai(30)`
  - Run chat agent
  - Simpan message + response ke `chat_sessions`
  - Return `{"response": str, "thread_id": str}`
- [ ] **Endpoint DELETE `/api/chat/clear`:**
  - Request body: `{"thread_id": str}`
  - Call `database.clear_chat_history(thread_id)`
  - Return `{"success": True}`
- [ ] **Endpoint POST `/api/analyze`:**
  - Request body: `{"days": int = 30}`
  - Run analysis
  - Return `{"result": str}`
- [ ] **Endpoint POST `/api/report`:**
  - Request body: `{"period_start": str, "period_end": str}`
  - Run report generation
  - Save to DB
  - Return `{"report": str, "id": int}`
- [ ] **Endpoint GET `/api/reports`:**
  - Query param: `limit: int = 10`
  - Return list of reports
- [ ] **Global error handler:** 500 errors return `{"error": "Internal server error", "detail": str(e)}`
- [ ] **Test:** `uvicorn main:app --reload`, akses http://localhost:8000/health → `{"status": "ok"}`
- [ ] **Test:** POST ke `/api/logs` dengan curl atau httpie, pastikan tersimpan

---

## PHASE 2 — Frontend Structure

### T2.1 Project Structure Setup
```
frontend/src/
├── api/
│   └── client.js          ← Axios instance + all API calls
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── MobileNav.jsx
│   │   └── Layout.jsx
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Slider.jsx
│   │   ├── Badge.jsx
│   │   ├── Toast.jsx
│   │   ├── Skeleton.jsx
│   │   ├── Spinner.jsx
│   │   └── EmptyState.jsx
│   ├── dashboard/
│   │   ├── StatCard.jsx
│   │   └── MiniChart.jsx
│   ├── charts/
│   │   ├── MoodEnergyChart.jsx
│   │   ├── SleepChart.jsx
│   │   ├── StressChart.jsx
│   │   └── SymptomChart.jsx
│   ├── chat/
│   │   ├── ChatBubble.jsx
│   │   ├── TypingIndicator.jsx
│   │   └── SuggestedQuestions.jsx
│   └── log/
│       ├── SliderField.jsx
│       ├── SymptomSelector.jsx
│       └── WaterSelector.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── LogToday.jsx
│   ├── History.jsx
│   ├── Chat.jsx
│   ├── Analyze.jsx
│   └── Report.jsx
├── hooks/
│   ├── useApi.js           ← Generic fetch hook with loading/error
│   ├── useLogs.js
│   └── useToast.js
├── context/
│   └── AppContext.jsx      ← Global state (toast, chat thread_id)
├── utils/
│   ├── formatters.js       ← Date, number, duration formatters
│   └── constants.js        ← Symptom list, nav items, etc.
├── App.jsx                 ← Router setup
├── main.jsx
└── index.css
```
- [ ] Buat semua folder dan file kosong (placeholder) sesuai struktur di atas

### T2.2 API Client (`src/api/client.js`)
- [ ] Buat axios instance dengan `baseURL: import.meta.env.VITE_API_URL`
- [ ] Timeout: 30000ms (AI response bisa lama)
- [ ] Interceptor request: log di development
- [ ] Interceptor response error: ekstrak pesan error yang meaningful
- [ ] Export fungsi:
  - `saveLogs(data)` → POST /api/logs
  - `getLogs(days)` → GET /api/logs?days=N
  - `getStats(days)` → GET /api/stats?days=N
  - `sendChat(message, threadId)` → POST /api/chat
  - `clearChat(threadId)` → DELETE /api/chat/clear
  - `analyzePatterns(days)` → POST /api/analyze
  - `generateReport(periodStart, periodEnd)` → POST /api/report
  - `getReports(limit)` → GET /api/reports
  - `healthCheck()` → GET /health
- [ ] **Test:** Import di App.jsx, call `healthCheck()`, pastikan response OK

### T2.3 Constants & Utils (`src/utils/`)
- [ ] `constants.js`:
  ```js
  export const SYMPTOM_OPTIONS = [
    'Sakit kepala', 'Mual', 'Pusing', 'Nyeri sendi', 'Kelelahan',
    'Demam', 'Batuk', 'Pilek', 'Sakit perut', 'Insomnia',
    'Sesak napas', 'Nyeri punggung', 'Nyeri dada', 'Kurang nafsu makan',
  ];
  export const NAV_ITEMS = [
    { to: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { to: '/log', label: 'Catat Hari Ini', icon: 'NotebookPen' },
    { to: '/history', label: 'Riwayat & Grafik', icon: 'BarChart2' },
    { to: '/chat', label: 'Tanya AI', icon: 'MessageCircle' },
    { to: '/analyze', label: 'Deteksi Pola', icon: 'Sparkles' },
    { to: '/report', label: 'Laporan Dokter', icon: 'FileText' },
  ];
  export const WATER_PRESETS = [500, 1000, 1500, 2000, 2500, 3000];
  export const DEFAULT_THREAD_ID = `user-${Date.now()}`;
  ```
- [ ] `formatters.js`:
  - `formatDate(dateStr)` → "Minggu, 5 Juli 2026"
  - `formatDateShort(dateStr)` → "5 Jul"
  - `formatScore(n)` → n toFixed(1) + "/10"
  - `formatHours(n)` → n toFixed(1) + " jam"
  - `formatMinutes(n)` → n + " menit"
  - `formatTime(isoStr)` → "14:30"

### T2.4 Global State (`src/context/AppContext.jsx`)
- [ ] Buat `AppContext` dengan React Context
- [ ] State: `toasts: []`, `threadId: localStorage.getItem('threadId') || uuid()`
- [ ] Simpan `threadId` ke localStorage setiap kali berubah
- [ ] Fungsi `addToast(type, title, message)`:
  - Push toast baru ke array
  - Auto-remove setelah 3000ms
- [ ] Fungsi `clearThread()`: reset threadId dan hapus dari localStorage
- [ ] Export `useApp()` custom hook

---

## PHASE 3 — UI Components

### T3.1 UI Primitives

#### Button (`src/components/ui/Button.jsx`)
- [ ] Props: `variant` (primary|secondary|danger|ghost), `size` (sm|md|lg), `loading`, `disabled`, `icon`, `children`, `onClick`, `className`
- [ ] Loading state: tampilkan `<Loader2>` spinner kiri text
- [ ] Disabled: opacity 50%, cursor not-allowed
- [ ] Semua variant sesuai StyleGuide.md

#### Card (`src/components/ui/Card.jsx`)
- [ ] Props: `children`, `className`, `hover`
- [ ] Style sesuai StyleGuide (border #F5CBCB, radius 16px, shadow)

#### Input (`src/components/ui/Input.jsx`)
- [ ] Props: `label`, `error`, `hint`, `icon`, semua native input props
- [ ] Label di atas, error di bawah dengan warna danger
- [ ] Focus ring `#C5B3D3`

#### Slider (`src/components/ui/Slider.jsx`)
- [ ] Props: `label`, `value`, `onChange`, `min`, `max`, `step`, `showValue`
- [ ] Custom CSS styling (track fill sesuai value)
- [ ] Value badge di kanan

#### Toast (`src/components/ui/Toast.jsx`)
- [ ] Baca dari AppContext.toasts
- [ ] Render di `fixed top-4 right-4 z-50 flex flex-col gap-2`
- [ ] Animasi slide in dari kanan
- [ ] Auto dismiss

#### Skeleton (`src/components/ui/Skeleton.jsx`)
- [ ] Props: `className`, `count`
- [ ] Animate pulse dengan warna `#FFE2E2`

#### EmptyState (`src/components/ui/EmptyState.jsx`)
- [ ] Props: `icon`, `title`, `description`, `action`
- [ ] Center di parent, icon besar muted, text tertata

### T3.2 Layout Components

#### Layout (`src/components/layout/Layout.jsx`)
- [ ] Sidebar (desktop) + MobileNav (mobile)
- [ ] Main content area dengan padding
- [ ] Toast renderer (via AppContext)

#### Sidebar (`src/components/layout/Sidebar.jsx`)
- [ ] Logo + "HealthLog AI" di top
- [ ] Nav items dengan NavLink (active state sesuai StyleGuide)
- [ ] Quick insight box di bottom (fetch saat mount, cache 1 jam)
- [ ] Background `#F7E8E8`, width 240px fixed

#### MobileNav (`src/components/layout/MobileNav.jsx`)
- [ ] Top bar: hamburger + logo + "+" button ke /log
- [ ] Bottom nav: 4 ikon utama (Dashboard, Log, Chat, Riwayat)
- [ ] Slide-out drawer untuk full nav (overlay background)

### T3.3 Dashboard Components

#### StatCard (`src/components/dashboard/StatCard.jsx`)
- [ ] Props: `label`, `value`, `unit`, `icon`, `trend`, `trendValue`, `color`
- [ ] Sesuai spec di StyleGuide.md
- [ ] Trend indicator (TrendingUp/Down) dengan warna success/danger

#### MiniChart (`src/components/dashboard/MiniChart.jsx`)
- [ ] Line chart kecil (Recharts) untuk 7 hari mood
- [ ] Minimal: tidak ada axis labels, hanya garis dan tooltip
- [ ] Stroke `#C5B3D3`

### T3.4 Chart Components (`src/components/charts/`)
- [ ] **MoodEnergyChart:** Recharts LineChart, dual line (mood + energi), responsive, tooltip, legend
- [ ] **SleepChart:** BarChart dengan color coding (merah/kuning/hijau), reference line 8 jam dan 6 jam
- [ ] **StressChart:** AreaChart, fill `#FFE2E2`, reference line 7
- [ ] **SymptomChart:** Horizontal BarChart, sorted by frequency, color `#F5CBCB`
- [ ] Semua chart: grid `#F5CBCB` opacity 30%, tooltip styling, axis text muted

### T3.5 Log Form Components

#### SliderField (`src/components/log/SliderField.jsx`)
- [ ] Props: `label`, `emoji`, `value`, `onChange`, `description`
- [ ] Label + emoji + deskripsi level + slider + value badge

#### SymptomSelector (`src/components/log/SymptomSelector.jsx`)
- [ ] Grid checkbox-style dari SYMPTOM_OPTIONS
- [ ] Custom text input untuk gejala manual
- [ ] Severity slider (hanya muncul jika ada gejala dipilih)

#### WaterSelector (`src/components/log/WaterSelector.jsx`)
- [ ] Grid preset buttons (500, 1000, 1500, 2000, 2500, 3000 ml)
- [ ] Active state: background `#C5B3D3`
- [ ] Custom input jika mau angka lain

### T3.6 Chat Components

#### ChatBubble (`src/components/chat/ChatBubble.jsx`)
- [ ] Props: `role` (user|assistant), `content`, `timestamp`
- [ ] Styling sesuai StyleGuide.md
- [ ] Markdown rendering basic (bold, italic, bullet list)

#### TypingIndicator (`src/components/chat/TypingIndicator.jsx`)
- [ ] 3 dots animasi (CSS keyframes)
- [ ] Sama seperti AI bubble styling

#### SuggestedQuestions (`src/components/chat/SuggestedQuestions.jsx`)
- [ ] Props: `questions: string[]`, `onSelect`
- [ ] Grid 2 kolom cards, klik → panggil onSelect

---

## PHASE 4 — Pages

### T4.1 Dashboard (`src/pages/Dashboard.jsx`)
- [ ] Fetch `getStats(7)` on mount
- [ ] Fetch `getLogs(7)` untuk chart
- [ ] Skeleton loader selama fetch
- [ ] Grid 4 StatCard (mood, energi, tidur, stres)
- [ ] Row bawah: MiniChart (kiri) + AI Insight card (kanan)
- [ ] AI Insight: fetch dari localStorage cache (key `insight_cache`) jika < 1 jam; jika tidak ada, panggil API `/api/quick-insight`
- [ ] Empty state jika belum ada data
- [ ] Greeting: "Selamat pagi/siang/sore/malam!" sesuai jam

### T4.2 Log Hari Ini (`src/pages/LogToday.jsx`)
- [ ] Form dengan 2 kolom (desktop), 1 kolom (mobile)
- [ ] State management dengan `useState` untuk semua field
- [ ] Default date: today
- [ ] Validasi: date wajib ada
- [ ] Submit: call `saveLogs(formData)`, show toast, reset form (opsional)
- [ ] Loading state pada button Submit
- [ ] Auto-scroll ke top setelah sukses

### T4.3 History (`src/pages/History.jsx`)
- [ ] Period selector (7/14/30/60/90 hari)
- [ ] Fetch `getLogs(days)` saat period berubah
- [ ] 4 metric cards di atas (rata-rata)
- [ ] Tabs: Mood & Energi | Tidur | Stres | Gejala | Data Lengkap
- [ ] Skeleton saat loading
- [ ] Tabel di tab "Data Lengkap": pagination 10 row/page
- [ ] Export CSV button (generate di frontend dari data yang sudah di-fetch)
- [ ] Empty state per tab

### T4.4 Chat (`src/pages/Chat.jsx`)
- [ ] Baca `threadId` dari AppContext
- [ ] State: `messages: [{role, content, timestamp}]`
- [ ] On mount: load suggested questions
- [ ] Submit: append user message, call `sendChat()`, append AI response
- [ ] Loading: tampilkan TypingIndicator selama waiting
- [ ] Auto-scroll ke bottom setiap pesan baru
- [ ] Keyboard: Enter kirim, Shift+Enter new line
- [ ] Clear button: call `clearChat()` + reset messages + generate new threadId

### T4.5 Analyze (`src/pages/Analyze.jsx`)
- [ ] Period selector (7/14/30/60 hari)
- [ ] Tombol "Mulai Analisis"
- [ ] Loading: full-area spinner dengan text "AI sedang menganalisis..."
- [ ] Hasil: render sebagai formatted text dalam card
- [ ] Download button (generate .txt dari hasil)
- [ ] Simpan hasil terakhir ke `sessionStorage` untuk persist saat navigasi

### T4.6 Report (`src/pages/Report.jsx`)
- [ ] Date range picker (start & end date)
- [ ] Tombol Generate
- [ ] Loading: spinner + "Membuat laporan medis terstruktur..."
- [ ] Preview laporan: monospace font dalam bordered box
- [ ] Download .txt button
- [ ] Section: "Laporan Sebelumnya" (accordion/collapsible)

---

## PHASE 5 — Integration & Testing

### T5.1 Connect Frontend ↔ Backend
- [ ] Pastikan `VITE_API_URL` di `.env` mengarah ke `http://localhost:8000`
- [ ] Test semua endpoint dari frontend:
  - Dashboard load stats ✓
  - Log form submit ✓
  - History fetch dan chart render ✓
  - Chat kirim pesan ✓
  - Analyze run ✓
  - Report generate ✓
- [ ] Test error handling: backend down → frontend tampil error state

### T5.2 Mobile Responsive
- [ ] Test di viewport 375px (iPhone SE)
- [ ] Test di viewport 768px (tablet)
- [ ] Bottom nav visible di mobile
- [ ] Sidebar hidden di mobile
- [ ] Form columns collapse ke single column di mobile
- [ ] Charts responsive (Recharts ResponsiveContainer)

### T5.3 Edge Cases
- [ ] Submit form tanpa tanggal → validation error
- [ ] Chat tanpa data kesehatan → AI respons gracefully
- [ ] API key invalid → error message yang jelas
- [ ] Network timeout → retry atau error state
- [ ] Empty database → dashboard empty state
- [ ] Logs tabel UNIQUE constraint → upsert benar (tidak duplicate)

---

## PHASE 6 — Deployment

### T6.1 Railway (Backend)
- [ ] Push backend ke GitHub repository
- [ ] Connect GitHub repo ke Railway
- [ ] Set environment variables di Railway dashboard:
  - `GEMINI_API_KEY`
  - `CORS_ORIGINS` (Vercel URL)
  - `PORT` (Railway auto-set)
- [ ] Add volume mount untuk SQLite persistence: `/app/healthlog.db`
- [ ] Deploy, tunggu build selesai
- [ ] Test endpoint: `https://your-app.railway.app/health`

### T6.2 Vercel (Frontend)
- [ ] Push frontend ke GitHub (bisa sama repo, subfolder)
- [ ] Connect GitHub ke Vercel, set root directory ke `frontend/`
- [ ] Set environment variable:
  - `VITE_API_URL=https://your-app.railway.app`
- [ ] Deploy
- [ ] Test full flow di production URL

### T6.3 Post-Deploy Testing
- [ ] Health check endpoint berjalan
- [ ] Save log dari production frontend → tersimpan di Railway SQLite
- [ ] Chat berfungsi (Gemini API key valid)
- [ ] Analyze berjalan (mungkin butuh 5-10 detik)
- [ ] Report generate berfungsi
- [ ] CORS tidak error (Vercel URL sudah masuk CORS_ORIGINS)

---

## PHASE 7 — Polish

### T7.1 Performance
- [ ] Lazy load halaman dengan React.lazy + Suspense
- [ ] Memoize komponen Chart dengan React.memo
- [ ] Debounce chat input (prevent rapid-fire API calls)
- [ ] Cache quick insight 1 jam di localStorage

### T7.2 UX Polish
- [ ] Tambah favicon (💚 emoji favicon)
- [ ] Page title berubah sesuai halaman (`<title>Dashboard | HealthLog AI</title>`)
- [ ] Smooth page transitions (fade)
- [ ] Keyboard shortcut: `N` untuk ke /log, `C` untuk ke /chat
- [ ] Konfirmasi sebelum clear chat

### T7.3 README Completion
- [ ] Screenshot app
- [ ] Instruksi setup lengkap
- [ ] Environment variables list
- [ ] Deployment guide (Railway + Vercel)
- [ ] Architecture diagram (ASCII)
