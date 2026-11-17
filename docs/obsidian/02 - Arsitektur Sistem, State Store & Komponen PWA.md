---
title: "Arsitektur Sistem, State Store & Komponen PWA Jalur Langit"
date: 2026-11-17
category: "Arsitektur & Teknis"
tags:
  - obsidian-tech
  - jalur-langit
  - nextjs-architecture
  - zustand-store
  - pwa-service-worker
  - web-audio-api
---

# 🏗️ Arsitektur Sistem, State Store & Komponen PWA Jalur Langit

> [!abstract] Ikhtisar Arsitektur
> Dokumen ini membedah rancangan arsitektur perangkat lunak, struktur state terpusat (*Zustand store*), skema antarmuka data TypeScript, utilitas penanganan waktu & audio, serta struktur komponen modular aplikasi **Jalur Langit PWA**.

---

## 🏛️ Diagram Arsitektur Aplikasi

```
┌────────────────────────────────────────────────────────┐
│                   PERANGKAT PENGGUNA                   │
│    (Mobile Smartphone Android / iOS / Desktop PC)      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             PROGRESSIVE WEB APP (PWA) LAYER            │
│  - Standalone Window Mode                              │
│  - Web App Manifest (manifest.json)                    │
│  - Web Notification API & Vibration API                │
│  - Web Audio API Sound Synthesizer (Chime Alert)       │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│               PRESENTATION LAYER (REACT 19)            │
│  - Navigation Header (Theme Switcher: Blush / Emerald) │
│  - CalendarMonthView (Januari - Desember)              │
│  - Tab Modules: Home, Amalan, GlowUp, Tasbih,          │
│                 Vision, Hajat, Quran                   │
│  - Modals: Hajat, Sedekah, Tadabbur, Kajian, Alarm     │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│            STATE & BUSINESS LOGIC (ZUSTAND 5)          │
│  useJalurLangitStore:                                  │
│  - State Amalan per Tanggal (amalanCompletionMap)      │
│  - State Glow Up & Air (glowUpMap)                     │
│  - State Tasbih & Multi-Tahap (dailyTasbihMap)         │
│  - State Hajat, Sedekah, Vision, Quran, & Kajian       │
│  - Pengaturan Alarm & Jadwal Notifikasi                │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│              LOCAL STORAGE PERSISTENCE                 │
│  Key: 'jalur-langit-calendar-storage-v3'               │
│  (100% Offline-First, Bebas Kuota, Privasi Terjaga)    │
└────────────────────────────────────────────────────────┘
```

---

## 📦 Skema Model Data TypeScript (`src/types/index.ts`)

### 1. Model Amalan & Jadwal Waktu
```typescript
export type TimeCategory = 'dini_hari' | 'subuh' | 'dhuha' | 'petang' | 'malam';

export interface AmalanItem {
  id: string;
  title: string;
  category: TimeCategory;
  arabicTitle?: string;
  description: string;
  virtue?: string;          // Fadhilah & dalil keutamaan
  targetCount?: number;     // Target wirid/bacaan
  targetUnit?: string;      // kali, juz, rakaat, rupiah
  isPriority?: boolean;     // Penanda amalan utama
  timeRange?: string;       // Contoh: "02:00 - 04:30 WIB"
}
```

### 2. Model Glow Up & Self-Care Muslimah
```typescript
export interface GlowUpHabits {
  waterGlasses: number;     // Target 8 gelas = 2 Liter
  morningSkincare: boolean;
  nightSkincare: boolean;
  workout30Min: boolean;
  reading15Min: boolean;
  sleep7Hours: boolean;
  healthyFood: boolean;
  mood: 'grateful' | 'happy' | 'peaceful' | 'tired' | 'sad';
  brainDump: string;        // Ruang curahan hati & pikiran
}
```

### 3. Model Tasbih & Riwayat Harian
```typescript
export interface TasbihPreset {
  id: string;
  name: string;
  arabicText: string;
  transliteration: string;
  meaning: string;
  defaultTarget: number;
  stages?: string[];        // ['Subhanallah', 'Alhamdulillah', 'Allahu Akbar']
}

export interface DailyTasbihProgress {
  count: number;
  target: number;
  completed: boolean;
}
```

### 4. Model Vision Board & Surat Masa Depan
```typescript
export interface VisionBoardItem {
  id: string;
  title: string;
  category: 'spiritual' | 'career' | 'health' | 'finance' | 'family';
  imageUrl: string;
  targetDate?: string;
  affirmation?: string;
  isAchieved: boolean;
}

export interface FutureLetter {
  id: string;
  title: string;
  content: string;
  createdDate: string;
  openDate: string;         // Tanggal segel dibuka
  isOpened: boolean;
}
```

### 5. Model Hajat, Sedekah Subuh & Quran Tadabbur
```typescript
export type HajatStatus = 'praying' | 'in_progress' | 'granted';

export interface HajatItem {
  id: string;
  title: string;
  notes: string;
  category: string;
  startDate: string;
  status: HajatStatus;
  targetDays: number;
  currentDay: number;
}

export interface SedekahItem {
  id: string;
  date: string;
  amount: number;           // Nominal Rupiah
  destination: string;      // Kotak masjid, anak yatim, dhuafa, dsb.
  intention: string;        // Niat & doa pengiring
}

export interface QuranTadabburItem {
  id: string;
  date: string;
  surahNumber: number;
  surahName: string;
  ayahRange: string;
  arabicText?: string;
  translation: string;
  kisahLatarBelakang: string; // Pilar 1: Kisah/Sebab Turunnya
  topikUtama: string;         // Pilar 2: Inti Pesan Ilahi
  hikmahRenungan: string;     // Pilar 3: Tadabbur & Muhasabah
  rencanaAksiNyata: string;   // Pilar 4: Eksekusi dalam Kehidupan
}
```

---

## 🗄️ State Management Terpusat (`src/store/useJalurLangitStore.ts`)

Zustand dikonfigurasi menggunakan middleware `persist` dengan kunci penyimpanan:
`jalur-langit-calendar-storage-v3`.

### Fitur Kunci Store:
1. **Navigasi Kalender Nyata**:
   - `selectedDate`: String tanggal format `YYYY-MM-DD` yang menjadi kunci utama seluruh data harian.
   - `calendarYear` & `calendarMonth`: Mengontrol tampilan kalender bulanan dari Januari s/d Desember.
   - `jumpToToday()`: Pintasan instan melompat ke tanggal hari ini sesuai kalender sistem.
2. **Kalkulator Persentase Otomatis**:
   - `getDateCompletionPercentage(dateStr, totalAmalan)`: Menghitung persentase amalan yang dicentang pada tanggal terpilih untuk menghasilkan bar kemajuan visual.
3. **Penyimpanan Multi-Pilar**:
   - `amalanCompletionMap`: Map centang checklist amalan per tanggal.
   - `glowUpMap`: Map kebiasaan glow up & gelas air per tanggal.
   - `dailyTasbihMap`: Map pencapaian tasbih per tanggal.
4. **Alarm & Notifikasi State**:
   - `notificationsEnabled`: Boolean status izin notifikasi.
   - `notificationTimes`: Record waktu jam per kategori amalan (`dini_hari`, `subuh`, `dhuha`, `petang`, `malam`).

---

## 🔔 Sistem Notifikasi & Audio Synthesizer (`src/utils/audioAlert.ts`)

Aplikasi mengimplementasikan **Web Audio API** mandiri tanpa dependensi berkas suara eksternal:

```typescript
export function playGentleChime() {
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  
  // Melodi lonceng 3 nada menenangkan: E5 (659Hz) -> B5 (987Hz) -> E6 (1318Hz)
  const tones = [
    { freq: 659.25, time: 0, duration: 0.6 },
    { freq: 987.77, time: 0.2, duration: 0.8 },
    { freq: 1318.51, time: 0.45, duration: 1.2 },
  ];

  tones.forEach(({ freq, time, duration }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
    gain.gain.setValueAtTime(0.001, ctx.currentTime + time);
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + time);
    osc.stop(ctx.currentTime + time + duration);
  });

  // Haptic Feedback HP
  if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200, 100, 400]);
  }
}
```

---

## 📱 Konfigurasi PWA (`public/manifest.json`)

```json
{
  "name": "Jalur Langit - 30 Day Muslimah Planner",
  "short_name": "Jalur Langit",
  "description": "Perencana Kehidupan Islami 30 Hari, Checklist Amalan, Dzikir, & Glow Up Habits",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fffaf9",
  "theme_color": "#0f3d2e",
  "icons": [
    {
      "src": "/icon.svg",
      "sizes": "192x192 512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

---
> Berkas arsitektur ini mendokumentasikan spesifikasi internal implementasi sistem.
