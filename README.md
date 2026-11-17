# 🌸 Jalur Langit — 30 Day Muslimah & Islamic Life Planner (PWA)

Aplikasi Progressive Web App (PWA) modern, offline-first, dan interaktif yang mentransformasi planner digital viral "30 Day Jurnal Jalur Langit & That Girl Muslimah" dari spreadsheet menjadi aplikasi web/mobile yang responsif, elegan, dan kaya fitur.

---

## ✨ Fitur Utama

1. **🏠 Beranda & Real Calendar View (Januari - Desember)**
   - Kalender kalender asli lengkap dari Januari sampai Desember.
   - Ringkasan 6 pilar hidup harian (Amalan, Glow Up, Tasbih, Vision, Quran, Hajat).
   - Visual progress bar pencapaian harian secara otomatis.

2. **🤲 Checklist Amalan Jalur Langit + Sinkronisasi Jam HP & Alarm**
   - Live synchronization dengan jam HP/perangkat.
   - Deteksi otomatis waktu amalan aktif (Dini Hari/Tahajjud, Subuh & Sedekah, Dhuha, Petang/Waqi'ah, Malam/Mulk).
   - Indikator jam amalan aktif dan penanda "Waktu Sekarang".
   - Alarm push notification browser & HP dengan nada lonceng lembut (*Web Audio API*) dan getaran haptic (*vibration*).
   - Pengaturan jam pengingat harian yang fleksibel.

3. **📿 Tasbih Digital Multi-Tahap (Sequential 33-33-33)**
   - Wirid Selepas Sholat terpisah bertahap:
     1. **Subhanallah** 33x (mencapai target lalu auto-reset ke 0).
     2. **Alhamdulillah** 33x (mencapai target lalu auto-reset ke 0).
     3. **Allahu Akbar** 33x (mencapai target lalu selebrasi wirid tuntas).
   - Pilihan target fleksibel (`33x`, `100x`, `500x`, `1000x`, `Custom Edit Target`).
   - Pilihan dzikir utama: Sholawat Jibril 1000x, Istighfar Taubat 1000x, Doa Nabi Yunus 100x, Hauqalah 100x, dan custom wirid.
   - Riwayat dzikir harian tersimpan per tanggal dan tercatat di Beranda.

4. **✨ Glow Up Habits & Muslimah Self-Care**
   - Tracker minum air 2 Liter (8 gelas interaktif).
   - Morning & Night Skincare routine, workout 30 menit, baca buku, 7 jam tidur, makan sehat.
   - Mood tracker harian interaktif & ruang curahan pikiran (*Brain Dump*).

5. **🎯 Vision Board & Manifestasi**
   - Papan visi visual berformat kartu foto & kategori (Spiritual, Karier, Finansial, Family, dsb).
   - Afirmasi positif Islami dengan tombol randomizer inspirasi.
   - Fitur surat masa depan (*Letter to Future Self*) dengan tanggal pembukaan (*seal date*).

6. **🤲 Papan Hajat & Sedekah Subuh**
   - Manajemen doa hajat dengan status (Dalam Doa, Sedang Diikhtiarkan, Terkabul).
   - Tracker Sedekah Subuh harian dengan input nominal Rupiah dan akumulasi total sedekah.

7. **📖 Quran Journaling & Tadabbur 4-Pilar**
   - 4 Pilar Tadabbur Al-Qur'an: Kisah/Latar Belakang, Topik Utama, Hikmah/Refleksi Diri, & Aksi Nyata Hari Ini.
   - Checklist Tilawah 1 Day 1 Juz (Grid 30 Juz visual).
   - Checklist 1 Day 1 Kajian & Jurnal Rasa Syukur (*Gratitude Journal*).

8. **🎨 Dual Theme Switching**
   - **That Girl Blush Rose 🌸**: Nuansa pink/peach/rose gold feminin yang lembut.
   - **Emerald Sage 🌿**: Nuansa hijau zamrud Islami elegan dengan aksen emas.

---

## 🚀 Menjalankan Aplikasi Secara Lokal

### Prasyarat
- Node.js 18+ atau 20+
- npm / yarn / pnpm

### Instalasi & Menjalankan Dev Server
```bash
# Install dependencies
npm install

# Jalankan server Next.js (port 3005 atau default 3000)
npm run dev -- -p 3005
```

Akses di browser Anda: `http://localhost:3005`

### Build untuk Produksi
```bash
npm run build
npm run start -- -p 3005
```

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router + Turbopack)
- **UI Library**: React 19, Tailwind CSS, Lucide React Icons
- **State Management**: Zustand dengan `persist` middleware (`localStorage`)
- **Effects & Audio**: Canvas Confetti, Web Audio API Sound Synthesizer, Web Notification API
- **Design Pattern**: Responsive PWA Mobile-First
