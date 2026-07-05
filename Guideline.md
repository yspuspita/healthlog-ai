# UI/UX Guideline — HealthLog AI

---

## 1. Design Philosophy

**Tenang. Hangat. Dipercaya.**

HealthLog AI harus terasa seperti jurnal kesehatan pribadi yang nyaman digunakan setiap hari — bukan seperti aplikasi medis yang dingin. Warna, tipografi, dan layout semuanya harus menciptakan rasa aman dan terpercaya.

**3 Prinsip Utama:**
1. **Calm** — Warna pastel, tidak ada elemen yang mencolok atau mengganggu
2. **Clear** — Setiap informasi mudah ditemukan, tidak ada clutter
3. **Caring** — Bahasa dan feedback yang hangat dan supportif

---

## 2. Layout Structure

### Desktop (≥1024px)
```
┌─────────────────────────────────────────────────────┐
│  Sidebar (240px fixed)  │  Main Content Area         │
│                         │                            │
│  Logo + App Name        │  Page Header               │
│  ─────────────────      │  ─────────────────────     │
│  Navigation Items       │  Content                   │
│                         │                            │
│  [Quick Insight box]    │                            │
│  [Stats mini widget]    │                            │
└─────────────────────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────────────┐
│  Top Bar             │
│  [☰] HealthLog  [+]  │
├──────────────────────┤
│                      │
│  Main Content        │
│                      │
├──────────────────────┤
│  Bottom Navigation   │
│  🏠  📊  💬  📋     │
└──────────────────────┘
```

---

## 3. Navigation

### Sidebar Items (Desktop)
```
💚 HealthLog AI          ← Logo + name (top)

─── Menu ─────────────
🏠 Dashboard
📝 Catat Hari Ini       ← Primary action, slightly prominent
📊 Riwayat & Grafik
💬 Tanya AI
🔍 Deteksi Pola
📋 Laporan Dokter

─── Bottom ────────────
[Quick Insight Card]
[7 hari tercatat]
```

### Active State
- Active nav item: background `#F5CBCB`, text `#8B6A8A` (purple), left border 3px `#C5B3D3`
- Hover state: background `#FFE2E2`

---

## 4. Page Layouts

### 4.1 Dashboard
```
┌─────────────────────────────────────────────────────┐
│ Selamat pagi! 🌸  [tanggal hari ini]                │
├────────────┬────────────┬────────────┬──────────────┤
│ Mood Card  │ Energi Card│ Tidur Card │ Stres Card   │
│ Avg 7 hari │ Avg 7 hari │ Avg 7 hari │ Avg 7 hari   │
├─────────────────────────┬───────────────────────────┤
│ Chart: Mood 7 hari      │ AI Insight Card           │
│ (line chart, small)     │ "Tidurmu minggu ini..."   │
└─────────────────────────┴───────────────────────────┘
```

### 4.2 Log Hari Ini
```
┌─────────────────────────────────────────────────────┐
│ 📝 Catat Kesehatanmu                [Simpan ▶]      │
├───────────────────────┬─────────────────────────────┤
│ KOLOM KIRI            │ KOLOM KANAN                  │
│                       │                             │
│ 📅 Tanggal            │ 🤒 Gejala                    │
│ 😊 Mood slider        │ 💊 Obat & Suplemen           │
│ ⚡ Energi slider      │ 🏃 Olahraga                  │
│ 😰 Stres slider       │ 💧 Hidrasi                   │
│ 😴 Tidur              │ 🍽️ Diet                     │
│                       │                             │
├───────────────────────┴─────────────────────────────┤
│ 📌 Catatan bebas (full width text area)              │
│                              [💾 Simpan Catatan]    │
└─────────────────────────────────────────────────────┘
```

### 4.3 Chat AI
```
┌─────────────────────────────────────────────────────┐
│ 💬 Tanya HealthLog AI          [🗑️ Clear]           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [AI Bubble] Halo! Aku punya akses ke data...      │
│                                                     │
│                [User Bubble] Kondisi saya minggu?  │
│                                                     │
│  [AI Bubble] Berdasarkan data 7 hari terakhir...   │
│                                                     │
├─────────────────────────────────────────────────────┤
│ [Tanyakan sesuatu tentang kesehatanmu...] [Kirim ▶] │
└─────────────────────────────────────────────────────┘
```

---

## 5. Component Specs

### Stat Card
- Background: `#FFFFFF` atau `#FBEFEF`
- Border: 1px `#F5CBCB`
- Border radius: 16px
- Padding: 20px
- Icon: 28px, warna `#C5B3D3`
- Value: 32px bold
- Label: 12px muted

### Slider Component
- Track background: `#FFE2E2`
- Track fill: `#C5B3D3`
- Thumb: white circle, shadow `0 2px 8px rgba(197,179,211,0.4)`
- Value label: badge di kanan slider

### Chat Bubbles
- User bubble: background `#C5B3D3`, text white, right-aligned, border-radius 18px 18px 4px 18px
- AI bubble: background `#FBEFEF`, text `#4A3F5C`, left-aligned, border-radius 18px 18px 18px 4px
- Timestamp: 11px muted, di bawah bubble

### Button Primary
- Background: `#C5B3D3`
- Hover: `#B09CC4` (5% darker)
- Text: white
- Border radius: 12px
- Padding: 12px 24px
- Font weight: 500

### Button Secondary
- Background: transparent
- Border: 1.5px `#C5B3D3`
- Text: `#8B6A8A`
- Hover background: `#FFE2E2`

### Form Input
- Background: white
- Border: 1.5px `#F5CBCB`
- Focus border: `#C5B3D3`
- Border radius: 12px
- Padding: 12px 16px

### Toast Notification
- Position: top-right
- Success: background `#F5CBCB`, icon ✓, text dark
- Error: background `#FFE2E2`, icon ✗

### Navigation Item (Sidebar)
- Default: transparent bg, text `#6B5B7B`
- Hover: `#FFE2E2` bg
- Active: `#F5CBCB` bg, left border 3px `#C5B3D3`, text `#4A3F5C` bold

---

## 6. Chart Styling (Recharts)

- **Line chart:** stroke `#C5B3D3` (mood), `#F5CBCB` (energi)
- **Bar chart tidur:** merah `#FFB3B3` jika < 6 jam, hijau `#B3D9C5` jika ≥ 7 jam, kuning `#FFE5B3` jika 6–7 jam
- **Area chart stres:** fill `#FFE2E2` dengan opacity 0.6, stroke `#F5CBCB`
- **Grid:** `#F5CBCB` dengan opacity 0.3
- **Tooltip:** background white, border `#F5CBCB`, border-radius 8px, shadow ringan
- **Axis text:** 11px, color `#9B8FA0`

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 768px | Bottom nav, single column |
| Tablet | 768px – 1023px | Sidebar collapsed (icon only) |
| Desktop | ≥ 1024px | Full sidebar, 2-column forms |

---

## 8. Motion & Animation

- Page transition: fade in 150ms ease-out
- Toast: slide in from right 200ms
- Loading spinner: `#C5B3D3`, 24px
- Chat bubble appear: fade up 150ms
- Sidebar open/close (mobile): slide 250ms ease-in-out
- Button press: scale(0.97) 100ms

---

## 9. Empty States

Setiap halaman harus punya empty state yang friendly:

- **Dashboard (no data):** Ilustrasi minimalis + "Belum ada data. Mulai catat kesehatanmu hari ini 🌸"
- **History (no data):** "Belum ada riwayat. Catat hari pertamamu!"
- **Chat:** Suggested questions cards
- **Analysis:** "Klik tombol di atas untuk memulai analisis"
- **Reports:** "Belum ada laporan yang dibuat"

---

## 10. Error States

- API error: banner merah muda `#FFE2E2` dengan icon ⚠️ dan pesan yang friendly
- Network offline: sticky banner di atas
- Form validation: pesan di bawah field, warna `#E07070`

---

## 11. Loading States

- Skeleton loader untuk stats cards dan charts
- Spinner `#C5B3D3` untuk button actions
- Full-page overlay dengan spinner untuk AI generation (analyze & report)
- Typing indicator (3 dots animasi) untuk chat AI response

---

## 12. Accessibility

- Semua form elements punya label
- Contrast ratio minimum 4.5:1 untuk body text
- Focus visible indicator: outline `#C5B3D3`
- aria-label untuk icon-only buttons
- Keyboard navigable
