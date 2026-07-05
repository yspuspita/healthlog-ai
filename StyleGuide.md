# Style Guide — HealthLog AI

---

## 1. Color System

### Brand Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `color-base` | `#FBEFEF` | Page background, outermost surface |
| `color-surface` | `#FFE2E2` | Card backgrounds, hover states |
| `color-border` | `#F5CBCB` | Borders, dividers, chart grid |
| `color-accent` | `#C5B3D3` | Primary buttons, active states, sliders, links |

### Extended Palette (derived)

| Token | Hex | Usage |
|-------|-----|-------|
| `color-accent-dark` | `#B09CC4` | Button hover, pressed state |
| `color-accent-light` | `#E8DFF0` | Accent backgrounds, tags |
| `color-text-primary` | `#2D1F3D` | Headlines, important text |
| `color-text-secondary` | `#6B5B7B` | Body text, nav items |
| `color-text-muted` | `#9B8FA0` | Captions, timestamps, placeholders |
| `color-white` | `#FFFFFF` | Form inputs, chat bubbles (user text bg) |
| `color-success` | `#B3D9C5` | Success states, good sleep indicator |
| `color-warning` | `#FFE5B3` | Warning states, moderate sleep |
| `color-danger` | `#FFB3B3` | Error states, poor sleep indicator |
| `color-sidebar-bg` | `#F7E8E8` | Sidebar background |
| `color-nav-active-bg` | `#F5CBCB` | Active nav item background |

### CSS Custom Properties (tailwind.config.js & globals.css)

```css
:root {
  --color-base: #FBEFEF;
  --color-surface: #FFE2E2;
  --color-border: #F5CBCB;
  --color-accent: #C5B3D3;
  --color-accent-dark: #B09CC4;
  --color-accent-light: #E8DFF0;
  --color-text-primary: #2D1F3D;
  --color-text-secondary: #6B5B7B;
  --color-text-muted: #9B8FA0;
  --color-sidebar-bg: #F7E8E8;
  --color-nav-active-bg: #F5CBCB;
  --color-success: #B3D9C5;
  --color-warning: #FFE5B3;
  --color-danger: #FFB3B3;
}
```

### Tailwind Config Extension

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#FBEFEF',
        surface: '#FFE2E2',
        border: {
          DEFAULT: '#F5CBCB',
          strong: '#E8B5B5',
        },
        accent: {
          DEFAULT: '#C5B3D3',
          dark: '#B09CC4',
          light: '#E8DFF0',
        },
        text: {
          primary: '#2D1F3D',
          secondary: '#6B5B7B',
          muted: '#9B8FA0',
        },
        sidebar: '#F7E8E8',
        success: '#B3D9C5',
        warning: '#FFE5B3',
        danger: '#FFB3B3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
        input: '12px',
        bubble: '18px',
        tag: '20px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(197, 179, 211, 0.12)',
        'card-hover': '0 4px 20px rgba(197, 179, 211, 0.2)',
        btn: '0 2px 8px rgba(197, 179, 211, 0.3)',
        input: '0 0 0 3px rgba(197, 179, 211, 0.2)',
      },
    },
  },
  plugins: [],
};
```

---

## 2. Typography

### Font Family
- **Primary:** Inter (Google Fonts)
- **Fallback:** system-ui, -apple-system, sans-serif

### Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| `text-display` | 32px | 600 | 1.2 | Page titles (mobile dashboard greeting) |
| `text-heading` | 24px | 600 | 1.3 | Page headings |
| `text-subheading` | 18px | 500 | 1.4 | Section headings, card titles |
| `text-body` | 15px | 400 | 1.6 | Body text, form labels |
| `text-small` | 13px | 400 | 1.5 | Captions, timestamps, hints |
| `text-tiny` | 11px | 400 | 1.4 | Badges, tags, axis labels |
| `text-stat` | 36px | 700 | 1.0 | Stat card values |
| `text-stat-sm` | 28px | 600 | 1.0 | Smaller stat values |

### Usage Rules
- Headlines: `color-text-primary` (#2D1F3D)
- Body: `color-text-secondary` (#6B5B7B)
- Muted/captions: `color-text-muted` (#9B8FA0)
- Never use pure black (#000000) — always use text tokens

---

## 3. Spacing System

Gunakan Tailwind spacing scale. Key values:

| Token | px | Usage |
|-------|-----|-------|
| `space-1` | 4px | Tight gaps (icon + text) |
| `space-2` | 8px | Inner padding small |
| `space-3` | 12px | Gap between related items |
| `space-4` | 16px | Standard gap |
| `space-5` | 20px | Card padding |
| `space-6` | 24px | Section gap |
| `space-8` | 32px | Large section gap |
| `space-10` | 40px | Page-level padding |
| `space-12` | 48px | Hero/header spacing |

---

## 4. Component Library

### 4.1 Button

```jsx
// Primary Button
<button className="
  bg-accent hover:bg-accent-dark active:scale-[0.97]
  text-white font-medium
  px-6 py-3 rounded-btn
  shadow-btn transition-all duration-150
  focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
">
  Label
</button>

// Secondary Button
<button className="
  bg-transparent border-[1.5px] border-accent
  text-accent hover:bg-surface
  px-6 py-3 rounded-btn font-medium
  transition-all duration-150
">
  Label
</button>

// Danger Button
<button className="
  bg-danger hover:bg-red-300 text-text-primary
  px-6 py-3 rounded-btn font-medium
  transition-all duration-150
">
  Label
</button>
```

### 4.2 Card

```jsx
<div className="
  bg-white border border-[#F5CBCB]
  rounded-card p-5 shadow-card
  hover:shadow-card-hover transition-shadow duration-200
">
  {children}
</div>
```

### 4.3 Input / Textarea

```jsx
<input className="
  w-full bg-white border-[1.5px] border-[#F5CBCB]
  rounded-input px-4 py-3
  text-text-secondary placeholder-text-muted
  focus:border-accent focus:shadow-input focus:outline-none
  transition-all duration-150
" />
```

### 4.4 Slider (Custom)

```css
/* Custom range input styling */
input[type='range'] {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background: linear-gradient(
    to right,
    #C5B3D3 0%,
    #C5B3D3 var(--value),
    #FFE2E2 var(--value),
    #FFE2E2 100%
  );
  border-radius: 3px;
  outline: none;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: white;
  border: 2px solid #C5B3D3;
  box-shadow: 0 2px 8px rgba(197, 179, 211, 0.4);
  cursor: pointer;
  transition: transform 0.1s;
}

input[type='range']::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}
```

### 4.5 Badge / Tag

```jsx
<span className="
  inline-flex items-center gap-1
  bg-accent-light text-text-secondary
  text-tiny font-medium
  px-3 py-1 rounded-tag
">
  label
</span>
```

### 4.6 Stat Card

```jsx
<div className="bg-white border border-[#F5CBCB] rounded-card p-5 shadow-card">
  <div className="flex items-center justify-between mb-3">
    <span className="text-small text-text-muted font-medium uppercase tracking-wide">
      Mood
    </span>
    <div className="w-9 h-9 rounded-full bg-accent-light flex items-center justify-center">
      <SmileIcon className="w-5 h-5 text-accent-dark" />
    </div>
  </div>
  <p className="text-stat font-bold text-text-primary">7.4</p>
  <p className="text-tiny text-text-muted mt-1">rata-rata 7 hari</p>
  <div className="mt-2 flex items-center gap-1 text-tiny text-success">
    <TrendingUpIcon className="w-3 h-3" />
    +0.3 dari minggu lalu
  </div>
</div>
```

### 4.7 Chat Bubble

```jsx
// AI Bubble
<div className="flex items-start gap-3 mb-4">
  <div className="w-8 h-8 rounded-full bg-accent-light flex-shrink-0 
                  flex items-center justify-center text-sm">💚</div>
  <div className="max-w-[75%]">
    <div className="bg-[#FBEFEF] text-text-primary px-4 py-3
                    rounded-[18px_18px_18px_4px] text-body leading-relaxed">
      {message}
    </div>
    <p className="text-tiny text-text-muted mt-1 ml-1">{time}</p>
  </div>
</div>

// User Bubble
<div className="flex items-start gap-3 mb-4 justify-end">
  <div className="max-w-[75%]">
    <div className="bg-accent text-white px-4 py-3
                    rounded-[18px_18px_4px_18px] text-body leading-relaxed">
      {message}
    </div>
    <p className="text-tiny text-text-muted mt-1 mr-1 text-right">{time}</p>
  </div>
</div>
```

### 4.8 Sidebar Nav Item

```jsx
<NavLink
  to={href}
  className={({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl
     transition-all duration-150 text-body font-medium
     ${isActive
       ? 'bg-[#F5CBCB] text-text-primary border-l-[3px] border-accent'
       : 'text-text-secondary hover:bg-[#FFE2E2] hover:text-text-primary'
     }`
  }
>
  <Icon className="w-5 h-5 flex-shrink-0" />
  {label}
</NavLink>
```

### 4.9 Skeleton Loader

```jsx
<div className="animate-pulse">
  <div className="h-4 bg-[#FFE2E2] rounded mb-2 w-3/4" />
  <div className="h-4 bg-[#FFE2E2] rounded mb-2 w-1/2" />
  <div className="h-8 bg-[#FFE2E2] rounded w-1/4" />
</div>
```

### 4.10 Toast

```jsx
// Success toast
<div className="
  fixed top-4 right-4 z-50
  bg-white border border-[#F5CBCB] 
  rounded-xl shadow-card
  px-5 py-4 flex items-center gap-3
  animate-slide-in-right
">
  <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-sm">✓</div>
  <div>
    <p className="font-medium text-text-primary text-body">{title}</p>
    <p className="text-small text-text-muted">{description}</p>
  </div>
</div>
```

---

## 5. Icon System

Gunakan **Lucide React** untuk semua ikon.

| Konsep | Icon Name | Usage |
|--------|-----------|-------|
| Dashboard | `LayoutDashboard` | Nav |
| Log Today | `NotebookPen` | Nav |
| History | `BarChart2` | Nav |
| Chat | `MessageCircle` | Nav |
| Analyze | `Sparkles` | Nav |
| Report | `FileText` | Nav |
| Mood | `Smile` | Stat card |
| Energy | `Zap` | Stat card |
| Sleep | `Moon` | Stat card |
| Stress | `Activity` | Stat card |
| Water | `Droplets` | Form |
| Exercise | `Dumbbell` | Form |
| Medicine | `Pill` | Form |
| Symptoms | `Thermometer` | Form |
| Save | `Save` | Button |
| Download | `Download` | Button |
| Clear | `Trash2` | Button |
| Send | `Send` | Chat |
| Loading | `Loader2` (spin) | Loading |
| Trend Up | `TrendingUp` | Stats |
| Trend Down | `TrendingDown` | Stats |

Ukuran standar:
- Nav icons: `w-5 h-5`
- Stat card icons: `w-5 h-5`
- Button icons: `w-4 h-4`
- Empty state icons: `w-12 h-12` dengan opacity 0.4

---

## 6. Animation Tokens

```css
/* globals.css */
@keyframes slide-in-right {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0);   opacity: 1; }
}

@keyframes fade-up {
  from { transform: translateY(8px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes typing-dot {
  0%, 60%, 100% { transform: translateY(0); }
  30%           { transform: translateY(-4px); }
}

.animate-slide-in-right { animation: slide-in-right 200ms ease-out; }
.animate-fade-up        { animation: fade-up 150ms ease-out; }
.animate-fade-in        { animation: fade-in 150ms ease-out; }

.typing-dot { animation: typing-dot 1.2s infinite; }
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }
```

---

## 7. Page Background

Body / root background: `#FBEFEF`
Main content area: `#FBEFEF`
Sidebar: `#F7E8E8`
Cards: `#FFFFFF`

```css
body {
  background-color: #FBEFEF;
  color: #6B5B7B;
  font-family: 'Inter', system-ui, sans-serif;
}
```

---

## 8. Do's and Don'ts

### ✅ DO
- Gunakan 4 warna brand untuk 95% UI
- Beri hover state di semua interactive elements
- Gunakan rounded corners (min 8px)
- Sertakan loading state di semua async operations
- Tulis pesan error yang friendly dan actionable

### ❌ DON'T
- Jangan gunakan pure black (#000000) atau pure white (#FFFFFF) sebagai text color
- Jangan gunakan border-radius: 0 (kecuali divider)
- Jangan tampilkan data mentah JSON ke user
- Jangan biarkan halaman kosong tanpa empty state
- Jangan gunakan warna yang tidak ada di palette (kecuali success/warning/danger)
