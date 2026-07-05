# PRD — HealthLog AI
**Version:** 1.0  
**Stack:** React + Tailwind (Vercel) · FastAPI + LangGraph (Railway)  
**Status:** Ready to Build

---

## 1. Overview

HealthLog AI adalah aplikasi jurnal kesehatan pribadi berbasis web yang memungkinkan pengguna mencatat kondisi harian, mendapatkan analisis pola dari AI, dan menghasilkan laporan terstruktur untuk dokter.

**Tagline:** *Catat. Pahami. Jaga Kesehatanmu.*

---

## 2. Problem Statement

Banyak orang tidak menyadari pola kesehatan mereka sendiri (misalnya: tidur kurang → sakit kepala keesokan harinya) karena pencatatan tidak konsisten dan tidak ada tools yang mudah untuk menganalisis data tersebut. Saat ke dokter, mereka juga sering tidak ingat detail gejala yang pernah muncul.

---

## 3. Target User

- Individu 18–45 tahun yang peduli kesehatan
- Orang dengan kondisi kronis yang perlu monitoring rutin
- Siapapun yang ingin memahami pola kesehatan mereka

---

## 4. Tech Stack

| Layer | Technology | Deployment |
|-------|-----------|------------|
| Frontend | React 18 + Vite + Tailwind CSS + shadcn/ui | Vercel |
| Backend | FastAPI (Python 3.11) | Railway |
| Database | SQLite (persisted on Railway volume) | Railway |
| AI Agent | LangGraph + Gemini 2.0 Flash | Railway |
| HTTP Client | Axios | — |
| Charts | Recharts | — |
| Icons | Lucide React | — |

---

## 5. Features

### 5.1 Dashboard (/)
- Ringkasan statistik 7 hari terakhir (mood, energi, tidur, stres)
- Mini chart tren mood 7 hari
- Quick insight AI (1–2 kalimat)
- Shortcut ke semua halaman

### 5.2 Log Hari Ini (/log)
- Form input lengkap:
  - Tanggal (default: hari ini)
  - Mood slider (1–10)
  - Energi slider (1–10)
  - Stres slider (1–10)
  - Jam tidur + kualitas tidur
  - Pilih gejala (multiselect dari preset + custom input)
  - Keparahan gejala (slider, muncul jika ada gejala)
  - Obat/suplemen (text area)
  - Olahraga (jenis + durasi menit)
  - Air minum (ml, dengan preset 500/1000/1500/2000ml)
  - Catatan diet
  - Catatan bebas
- Auto-save indikator
- Toast notifikasi sukses

### 5.3 Riwayat & Grafik (/history)
- Filter periode: 7 / 14 / 30 / 60 / 90 hari
- 4 chart interaktif (Recharts):
  - Line chart: Mood & Energi
  - Bar chart: Jam Tidur (merah jika < 6 jam)
  - Area chart: Level Stres
  - Bar chart horizontal: Frekuensi Gejala
- Tabel data lengkap dengan pagination
- Export CSV

### 5.4 Chat AI (/chat)
- Chat interface multi-turn dengan LangGraph memory
- Suggested questions saat pertama buka
- AI punya konteks 30 hari data kesehatan user
- Loading state dengan animasi
- Clear conversation button

### 5.5 Deteksi Pola (/analyze)
- Trigger analisis manual (button)
- Pilih periode: 7 / 14 / 30 / 60 hari
- Hasil analisis ditampilkan dalam card terstruktur per kategori
- Download hasil sebagai .txt

### 5.6 Laporan Dokter (/report)
- Date range picker (periode laporan)
- Generate laporan terformat
- Preview laporan di halaman
- Download .txt
- Riwayat laporan sebelumnya

---

## 6. API Endpoints (Backend FastAPI)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| POST | /api/logs | Save health log |
| GET | /api/logs?days=30 | Get logs |
| GET | /api/stats?days=7 | Get stats summary |
| POST | /api/chat | Send chat message |
| DELETE | /api/chat/clear | Clear chat history |
| POST | /api/analyze | Run pattern analysis |
| POST | /api/report | Generate doctor report |
| GET | /api/reports | Get past reports |

---

## 7. Data Schema

### health_logs table
```sql
CREATE TABLE health_logs (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    date              TEXT NOT NULL UNIQUE,
    mood              INTEGER,
    energy            INTEGER,
    sleep_hours       REAL,
    sleep_quality     INTEGER,
    symptoms          TEXT,
    symptom_severity  INTEGER,
    medications       TEXT,
    exercise_type     TEXT,
    exercise_mins     INTEGER,
    water_ml          INTEGER,
    stress_level      INTEGER,
    diet_notes        TEXT,
    notes             TEXT,
    created_at        TEXT
);
```

### reports table
```sql
CREATE TABLE reports (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    generated_at    TEXT,
    period_start    TEXT,
    period_end      TEXT,
    report_content  TEXT
);
```

### chat_sessions table
```sql
CREATE TABLE chat_sessions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    thread_id   TEXT NOT NULL,
    role        TEXT NOT NULL,
    content     TEXT NOT NULL,
    created_at  TEXT
);
```

---

## 8. Environment Variables

### Backend (.env)
```
GEMINI_API_KEY=your_key_here
DATABASE_URL=sqlite:///./healthlog.db
CORS_ORIGINS=http://localhost:5173,https://your-app.vercel.app
PORT=8000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

---

## 9. Deployment

### Railway (Backend)
- `railway.toml` untuk konfigurasi
- Volume mount untuk SQLite persistence
- Auto-deploy dari GitHub main branch
- Environment variables di Railway dashboard

### Vercel (Frontend)
- `vercel.json` untuk konfigurasi
- Build command: `npm run build`
- Output dir: `dist`
- Environment variables: `VITE_API_URL`

---

## 10. Non-Functional Requirements

- Response time AI < 10 detik
- Mobile responsive (min width 375px)
- Data tersimpan lokal (privasi by design)
- Error handling di semua API call
- Loading states untuk semua async operations
- Graceful degradation jika backend offline

---

## 11. Out of Scope (v1)

- Authentication / multi-user
- Push notifications / reminders
- Wearable device integration
- Image upload
- Voice input
