---
title: "Product Requirement Document (PRD): Jalur Langit — 30 Day Muslimah Planner PWA"
date: 2026-11-20
version: "2.5.0-production"
status: "Completed & Deployed"
author: "Antigravity Engineering Team & Product Owner"
tags:
  - prd
  - jalur-langit
  - nextjs-pwa
  - system-specification
  - muslimah-planner
---

# 📖 Product Requirement Document (PRD)
## Jalur Langit — 30 Day Muslimah & Islamic Life Planner PWA

> [!NOTE]
> **Dokumen Spesifikasi Produk Resmi (PRD)** ini merangkum seluruh arsitektur, alur otentikasi, modul fitur, integrasi hardware gawai, sistem administrasi, hingga alur *logout* dari aplikasi Progressive Web App (PWA) **Jalur Langit**. Dokumen ini menjadi acuan tunggal (*single source of truth*) pengembangan, audit kualitas, dan skalabilitas sistem ke depan.

---

## 1. Eksekutif Ringkasan & Visi Produk

### 1.1 Latar Belakang & Masalah
Produk digital **"30 Day Journal Jalur Langit & That Girl Muslimah Planner"** mulanya beredar luas di media sosial (TikTok, Instagram) dan platform Lynk.id dalam format *spreadsheet* statis (Google Sheets / Notion). Meskipun konten spiritualnya disukai ribuan muslimah, format *spreadsheet* memiliki kelemahan mendasar:
1. **Pengalaman Pengguna Buruk di Mobile**: Membuka Google Sheets di layar HP terasa lambat, teks terpotong, dan kotak centang (*checkbox*) terlalu kecil.
2. **Tidak Ada Pengingat & Otomasi Waktu**: Pengguna sering lupa amalan karena tidak ada alarm/notifikasi yang menyesuaikan jadwal sholat setempat.
3. **Tasbih Kaku**: Dzikir harus diketik manual per angka di sel spreadsheet, tanpa interaksi audio, haptik, maupun animasi visual yang menenangkan.
4. **Resiko Pembajakan & Distribusi Ilegal**: File spreadsheet sekali unduh dapat dibagikan secara bebas tanpa proteksi lisensi.

### 1.2 Visi & Solusi Produk
Mentransformasikan lembaran spreadsheet statis menjadi aplikasi web mandiri berstandar industri: **Progressive Web App (PWA) berbasis Next.js 16 (App Router + Turbopack)** yang *offline-first*, elegan, responsif *mobile-first*, terproteksi sistem lisensi pembeli Lynk.id, serta menghadirkan pengalaman spiritual yang imersif dan menenangkan hati.

### 1.3 Target Pengguna (User Persona)
* **Muslimah Muda & Profesional (Usia 18–35 tahun)**: Memiliki target impian besar (karir, jodoh, rezeki, keluarga), ingin istiqomah menjalankan amalan sunnah (*Jalur Langit*), serta membangun kebiasaan hidup sehat dan teratur (*That Girl Muslimah*).
* **Karakteristik Kebutuhan**: Menginginkan aplikasi praktis, bisa dibuka offline di musholla/masjid tanpa kuota, ada suara tasbih nyata, pengingat adzan/waktu sholat otomatis, dan tampilan yang estetik (*Blush Rose & Emerald Sage*).

---

## 2. Arsitektur Teknologi & Tech Stack

| Lapisan Sistem | Teknologi / Library | Keterangan & Peran |
| :--- | :--- | :--- |
| **Framework Utama** | Next.js 16.4.6 (App Router) | Engine server & static generation dengan Turbopack |
| **Bahasa Pemrograman** | TypeScript 5.x | *Type safety* penuh pada seluruh data model dan state |
| **UI Library & Styling** | React 19 + Tailwind CSS v4 | Antarmuka responsif modern, fluid typography, dark mode |
| **Komponen Ikon & Animasi**| Lucide React + Canvas Confetti | Ikonografi bersih, selebrasi konfeti saat amalan tuntas |
| **State Management** | Zustand v5 (`persist` middleware) | Manajemen state lokal terdistribusi, tersimpan aman di `localStorage` |
| **Audio Engine** | Web Audio API (Singleton Context) | Sintesis audio kaca kristal "ting-ting" 0ms latensi tanpa macet |
| **Haptic Feedback** | Navigator Vibration API | Getaran mikro responsif di setiap ketukan tasbih dan tombol |
| **Perhitungan Waktu Sholat** | Algoritma Astronomi Geolocation | Menghitung waktu sholat presisi (Subuh s/d Isya) berdasarkan GPS |
| **Sistem Notifikasi** | Web Notification & Service Worker | Alarm amalan terjadwal dan kapabilitas installable PWA |
| **Integrasi Pembayaran** | Webhook Lynk.id (JSON API) | Auto-whitelisting pembeli setelah transaksi berhasil |
| **Hosting & CI/CD** | Vercel Production + GitHub | Deployment otomatis dari branch `master` dan `main` |

---

## 3. Alur Autentikasi, Lisensi Pembeli & Hak Akses (Auth Flow)

```
┌──────────────────────────────────────────────────────────────────┐
│                      PENGGUNA MEMBUKA APLIKASI                   │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
                                  ▼
               ┌──────────────────────────────────────┐
               │  Apakah sudah login (Auth Session)? │
               └──────────┬────────────────┬──────────┘
                      YA  │                │ TIDAK
                          │                ▼
                          │    ┌───────────────────────┐
                          │    │  Halaman Login        │
                          │    │  Input Email Pembeli  │
                          │    └───────────┬───────────┘
                          │                │
                          │                ▼
                          │    ┌───────────────────────┐
                          │    │ Verifikasi Whitelist  │
                          │    │ Pembeli Lynk.id       │
                          │    └───────┬───────┬───────┘
                          │     VALID  │       │ TIDAK DITEMUKAN
                          │            │       ▼
                          │            │  ┌───────────────────────┐
                          │            │  │ Tampilkan Pesan Error │
                          │            │  │ "Email Belum Beli"    │
                          │            │  │ + Tombol Beli Lynk.id │
                          │            │  └───────────────────────┘
                          │            ▼
                          │    ┌───────────────────────┐
                          │    │ LoginTransitionLoader │
                          │    │ (Animasi Spiritual 2s)│
                          │    └───────────┬───────────┘
                          │                │
                          ▼                ▼
┌──────────────────────────────────────────────────────────────────┐
│                   DASHBOARD JALUR LANGIT PWA                     │
│               Akses Fitur Sesuai Tier Pembeli                    │
└──────────────────────────────────────────────────────────────────┘
```

### 3.1 Halaman Login (`/login`)
* **Antarmuka**: Latar belakang elegan bertema *Spiritual Oasis* dengan logo resmi Jalur Langit, kutipan penyejuk hati, dan input form email minimalis.
* **Mekanisme Validasi**:
  * Pengguna memasukkan alamat email yang digunakan saat bertransaksi di Lynk.id.
  * Sistem mengecek keberadaan email pada `useAuthStore` dan whitelist API (`/api/auth/verify-buyer`).
* **Penanganan Akses Ditolak (`not_purchased`)**:
  * Apabila email belum terdaftar di daftar pembeli, muncul dialog informasi persuasif yang ramah: *"Email Anda belum terdaftar sebagai pembeli resmi Jalur Langit Planner"*.
  * Disertai tombol langsung ke halaman checkout produk Lynk.id.
* **Transisi Menenangkan (`LoginTransitionLoader`)**:
  * Setelah email valid, pengguna disuguhkan layar transisi spiritual dengan pesan selamat datang, dzikir pembuka, dan efek fading halus selama 2 detik sebelum masuk ke `/dashboard`.

### 3.2 Tier Pembeli & Matriks Entitlement

| Paket Produk | Harga Lynk.id | Tab & Fitur yang Dapat Diakses |
| :--- | :--- | :--- |
| **Starter** | Rp 49.000 | Beranda, Checklist Amalan 30 Hari, Tasbih 3D & Dzikir. |
| **Full Bundling (Ultimate)** | Rp 89.000 | Seluruh Paket Starter + Vision Board, Papan Hajat & Sedekah Subuh, Quran & Tadabbur Journal. |
| **VIP Ultimate + Lab** | Rp 149.000 | Seluruh Fitur Lengkap + Modul Glow Up Syar'i (7 Pilar), Surat Masa Depan (*Future Letters*), dan Akses Gratis Pembaruan Fitur Lab. |

### 3.3 Sesi Persisten & Alur Logout
* **Auto-Login**: Sesi otentikasi disimpan dalam storage persisten (`jalur-langit-auth`), sehingga saat aplikasi ditutup dan dibuka kembali, pengguna langsung masuk tanpa harus mengetik email berulang kali.
* **Logout**: Tombol logout di profil gawai/pengaturan akan membersihkan sesi aktif, menghapus cache sementara, dan mengembalikan tampilan secara aman ke `/login`.

---

## 4. Struktur Navigasi & Tata Letak Aplikasi (Layout & UI)

### 4.1 Header Bar Dinamis
* **Indikator Tanggal Aktif**: Menampilkan tanggal Masehi dalam Bahasa Indonesia (contoh: *Jumat, 20 November 2026*) yang dapat diklik untuk memilih tanggal amalan lain.
* **Pemberitahuan Waktu Sholat Terdekat**: Menampilkan hitung mundur (*countdown*) menuju adzan berikutnya.
* **Theme Mode Switcher**: Tombol pengubah mode Gelap (*Emerald Dark*) dan mode Terang (*Blush Pearl*).
* **Indikator Profil & Tier**: Menampilkan badge tier pengguna (Starter / Ultimate / VIP).

### 4.2 Kalender Istiqomah Bulanan (Januari – Desember)
* **Tampilan Grid 12 Bulan Utuh**: Responsif di smartphone tanpa terpotong dan tanpa scrollbar horizontal canggung.
* **Indikator Hari Ini (*Today Highlight*)**: Outline emas berdenyut halus (*pulsing gold border*) yang menarik perhatian tanpa mengganggu tata letak tanggal.
* **Ikon Love Animasi Progres**:
  * **Capaian 100%**: Logo love berwarna hijau penuh dengan teks `100%`.
  * **Capaian Berjalan (< 100%)**: Logo love dengan isi warna proporsional sesuai persentase amalan yang tuntas dikerjakan.

### 4.3 Bottom Navigation Dock
Menu navigasi melayang (*dock*) ergonomis di bagian bawah layar ponsel yang mudah dijangkau ibu jari:
1. 🏠 **Beranda** (`/dashboard`)
2. ✅ **Amalan** (`/amalan`)
3. 📿 **Tasbih** (`/tasbih`)
4. 🌸 **Glow Up** (`/glowup`)
5. 🎯 **Vision** (`/vision`)
6. 🤲 **Hajat** (`/hajat`)
7. 📖 **Quran** (`/quran`)

---

## 5. Spesifikasi Lengkap 8 Modul Fitur Utama

### 5.1 Modul 1: Beranda & Ringkasan Harian (`/dashboard`)
* **Spiritual Progress Meter**: Menampilkan persentase ketuntasan amalan hari ini, skor istiqomah, dan total sedekah terkumpul.
* **Waktu Sholat Presisi GPS**: Menghitung 8 waktu ibadah otomatis (Tahajjud, Subuh, Syuruq/Terbit, Dhuha, Dzuhur, Ashar, Maghrib, Isya) sesuai koordinat geografis pengguna.
* **Quotes Motivasi Harian**: Kutipan inspiratif berganti setiap hari dari Al-Qur'an dan petuah ulama salaf.
* **Pemberitahuan Cepat**: Rekomendasi amalan utama yang paling relevan dengan waktu gawai saat ini.

---

### 5.2 Modul 2: Checklist Amalan Jalur Langit 30 Hari (`/amalan`)
* **5 Jendela Waktu Amalan**:
  1. **🌙 Dini Hari (02:40 – 03:32)**: Sholat Tahajjud, Sholat Witir, Munajat Hajat Khusus.
  2. **☀️ Subuh (03:32 – 05:00)**: Sholat Qobliyah Subuh, Sholat Subuh Tepat Waktu, Istighfar Sahur 100x, Sedekah Subuh, Dzikir Pagi.
  3. **🌤️ Dhuha & Siang (05:30 – 14:32)**: Sholat Dhuha, Sholat Dzuhur & Ba'diyah, Ikhtiar Bumi Profesional.
  4. **🌅 Petang (14:32 – 17:24)**: Sholat Ashar Tepat Waktu, Dzikir Petang, Membaca QS. Al-Waqi'ah.
  5. **🌙 Malam (17:24 – 23:00)**: Sholat Maghrib & Ba'diyah, Sholat Isya & Ba'diyah, Membaca QS. Al-Mulk, Sholawat Jibril 1.000x, Sayyidul Istighfar, Muhasabah & Gratitude Journal.
* **Ticking Real-Time 5 Detik & Deteksi Slot Waktu Aktif**:
  * Jam gawai dipantau setiap 5 detik secara reaktif.
  * Amalan yang masuk rentang waktu saat ini otomatis ditandai dengan **badge berdenyut "Waktu Sekarang"** dan **garis tepi emas keemasan**.
* **Integrasi Lintas Modul (*Deep Linking*)**:
  * Terdapat tombol aksi langsung di card amalan (contoh: `Kerjakan di Tasbih (1000x) →`, `Catat Sedekah Subuh →`, `Buka QS. Al-Waqi'ah di Quran →`).
  * Saat aktivitas di modul tujuan selesai, amalan di checklist otomatis tercentang tuntas.

---

### 5.3 Modul 3: Tasbih 3D & Dzikir Digital Berkelanjutan (`/tasbih`)
* **Fisik Untaian 33 Biji Bulat Utuh + Biji Lonjong Pembatas Murni**:
  * Setiap siklus dzikir terdiri dari **33 biji bulat penuh**, disusul oleh **1 biji lonjong pembatas (Imam Bead) dengan rumbai emas** di posisi ke-34, 68, dan 102.
  * Biji lonjong pembatas tidak dihitung sebagai salah satu dari 33 hitungan, melainkan bertindak sebagai penanda fisik putaran.
* **Pewarnaan Multi-Tahap Bertahap (*Continuous Bead Gradient*)**:
  * **33 Pertama (Subhanallah)**: Biji bulat bercahaya **Oranye / Emas** (`gold`).
  * **Biji Lonjong Pembatas**: Kayu kenari berpelitur alami dengan cincin emas dan rumbai emas.
  * **33 Kedua (Alhamdulillah)**: Biji bulat setelah pembatas menyala warna **Hijau Zamrud** (`emerald`) terhitung mulai dari 1. Biji Subhanallah di untaian bawah tetap mempertahankan warna oranye.
  * **33 Terakhir (Allahu Akbar)**: Biji bulat menyala warna **Biru Safir** (`sapphire`).
* **Efek Suara Aduan Gelas "Ting-Ting" (*Crystal Clink Audio Engine*)**:
  * Memakai arsitektur **Singleton AudioContext** pada `src/utils/tasbihAudio.ts` (anti-macet, tidak terkena limit kuota browser mobile).
  * Menggunakan file audio rekaman asli `public/sounds/tasbih_click.mp3` dan `tasbih_click.wav`.
  * Dilengkapi *dual-tone glass synthesizer* (1920 Hz & 3050 Hz + metallic transient 4800 Hz) dengan variasi mikro-pitch alami ±2%, berlatensi 0ms.
* **Animasi Berayun Alami Kiri-Kanan (*Realistic Hanging Pendulum Sway*)**:
  * Untaian tasbih yang tergantung di bawah cincin fokus berayun lembut ke kiri dan ke kanan secara organik (periode tenang 3.8s, akselerasi GPU 60fps/120fps).
  * Rumbai emas turut berayun mengikuti gravitasi dan ayunan tangan.
* **Sholawat Jibril Versi Panjang**:
  * Teks Latin: `Shallallahu 'ala Muhammad, shallallahu 'alaihi wasallam`.
  * Teks Arab: `صَلَّى اللهُ عَلَى مُحَمَّدٍ، صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ`.
* **Tipografi Latin Besar & Tegas**:
  * Teks bacaan Latin ditampilkan dalam ukuran besar, tebal, dan huruf kapital (*extrabold uppercase*) agar sangat jelas terbaca saat berdzikir.
* **Modal Pemilihan Dzikir dengan Teks Latin Murni**:
  * Daftar pada modal *"Pilih Dzikir & Wirid"* menampilkan teks transliterasi Latin murni yang elegan dan informatif.
* **Tombol Lingkaran "Sudah" di Sebelah Kanan Tasbih**:
  * Tombol melayang di kuadran kanan bawah layar tasbih.
  * Ikon centang berwarna abu-abu jika belum selesai, dan seketika berubah menjadi kuning emas menyala saat diklik.
  * Memicu ledakan konfeti emas, getar haptik, otomatis menandai checklist amalan sebagai selesai, lalu kembali otomatis ke checklist.
* **Penghitungan Harian Per Tanggal Aktif**:
  * Counter *"Total Dzikir Hari Ini"* murni menghitung akumulasi ketukan pada tanggal yang sedang dibuka (tidak mencampuradukkan riwayat hari-hari lain).
  * Tombol `- Kurang 1` turut memotong hitungan harian pada tanggal tersebut secara sinkron.

---

### 5.4 Modul 4: Papan Hajat Spesifik & Sedekah Subuh (`/hajat`)
* **Papan Hajat (Dua Board)**:
  * Pengelompokan 7 kategori: Rezeki, Karir, Jodoh, Keluarga, Kesehatan, Spiritual, Lainnya.
  * Status Hajat: *Berikhtiar ➔ Menunggu ➔ Terkabul ➔ Hikmah*.
  * Pencatatan tanggal target, tanggal terkabul (*answered date*), dan refleksi hikmah.
* **Sedekah Subuh Tracker**:
  * Pencatatan nominal rupiah, pihak/tempat penerima sedekah, dan doa khusus yang diniatkan saat bersedekah.
  * Menghitung total akumulasi dana sedekah yang telah dikeluarkan selama program 30 hari.
  * Otomatis mencentang amalan *Sedekah Subuh* di kalender.

---

### 5.5 Modul 5: Quran, Tadabbur, 1 Day 1 Juz & Kajian (`/quran`)
* **Tadabbur Surat Pilihan Rutin**:
  * Card khusus untuk **QS. Al-Waqi'ah** (dibaca petang) dan **QS. Al-Mulk** (dibaca malam/sebelum tidur) dengan tombol centang pembacaan instan.
  * Formulir Tadabbur Ayat Mandiri (4 Rukun: Kisah Ayat, Topik, Hikmah, dan Rencana Aksi Nyata).
* **1 Day 1 Juz Khatam Tracker**:
  * Grid interaktif 30 Juz Al-Qur'an.
  * Pengguna menandai juz yang telah dibaca setiap hari hingga khatam 30 juz di hari ke-30.
* **1 Day 1 Kajian**:
  * Buku catatan resume kajian ustadz/ustadzah harian (judul, pemateri, link YouTube/kajian, intisari, dan tindak lanjut amalan).
* **Muhasabah & Gratitude Journal**:
  * Lembar syukur harian: mencatat 3 nikmat yang paling disyukuri hari ini dan ikrar memaafkan semua orang sebelum tidur.

---

### 5.6 Modul 6: Glow Up Syar'i — That Girl Muslimah Habits (`/glowup`)
* **7 Pilar Kebiasaan Sehat Muslimah**:
  1. 💧 **Hidrasi 8 Gelas Air (2 Liter)**: Tombol interaktif pengisian gelas 1 s/d 8.
  2. 🧴 **Skincare Pagi Syar'i**: Perlindungan kulit halal & sunnah wudhu.
  3. 🌙 **Skincare Malam & Adab Tidur**: Membersihkan wajah, membaca doa tidur, wudhu sebelum tidur.
  4. 🧘‍♀️ **Olahraga Sunnah 30 Menit**: Stretching, jalan pagi, atau senam ringan.
  5. 📚 **Membaca Buku/Ilmu 15 Menit**: Peningkatan wawasan spiritual/intelektual.
  6. 😴 **Tidur Cukup 7 Jam**: Istirahat berkualitas sesuai sunnah.
  7. 🥗 **Makanan Halal & Thayyib**: Pola konsumsi bergizi dan berkah.
* **Mood Tracker Harian**: Memilih suasana hati hari ini (*Bahagia, Tenang, Bersyukur, Lelah, Cemas, Berharap*).
* **Brain Dump Journal**: Wadah curhat dan menjernihkan pikiran dari beban mental sebelum tidur.

---

### 5.7 Modul 7: Vision Board & Surat Masa Depan (`/vision`)
* **Vision Board Impian**:
  * Menyusun kartu impian visual (Karir, Finansial, Spiritual, Kesehatan, Lifestyle, Target Haji/Umroh).
  * Pengunggahan gambar impian, tenggat waktu (*deadline* doa), dan status pencapaian.
* **Surat untuk Diri Sendiri di Masa Depan (*Future Letters*)**:
  * Menulis surat reflektif yang disegel secara digital.
  * Surat terkunci rapat dan baru bisa dibuka otomatis saat tanggal pembukaan (*open date*) tiba di masa mendatang.

---

### 5.8 Modul 8: Roadmap Fitur & Umpan Balik Pengguna (`/roadmap`)
* Transparansi rencana pengembangan aplikasi (Arah Kiblat, Kalkulator Zakat, Audio Murottal, Pengingat Siklus Haid Fiqih Wanita).
* Formulir terbuka bagi pembeli untuk mengajukan saran fitur baru yang langsung masuk ke database sistem.

---

## 6. Panel Admin & Manajemen Pembeli (`/panel-admin`)

### 6.1 Fitur Panel Admin
1. **Keamanan Masuk CMS**: Dilindungi dengan kode kunci admin khusus (*Admin Secret Key*).
2. **Dashboard Ringkasan Penjualan**:
   * Grafik batang penjualan paket (*PackageSalesBarChart*): membandingkan total penjualan Paket Starter, Ultimate, dan VIP.
   * Total omzet pendapatan (dalam Rupiah) dan total seluruh pembeli aktif.
3. **Pemantau Pengguna Aktif (*Active Users & Presence Card*)**:
   * Melacak status pengguna: *Online Sekarang* (< 15 menit), *Aktif Hari Ini*, dan *Offline*.
   * Filter cepat: *Semua*, *Online*, *Hari Ini*, dan *Offline*.
4. **Tabel Manajemen Pembeli**:
   * Pencarian instan berdasarkan Nama, Email, atau ID Pesanan Lynk.id.
   * Filter per Tier (Starter, Ultimate, VIP).
   * Paginasi cerdas (10, 25, 50 entri per halaman).
   * Aksi Admin:
     * Tambah pembeli manual (*Add Buyer*).
     * Ubah tier pembeli (*Upgrade/Downgrade*).
     * Hapus akses pembeli (*Revoke Access*).
     * Ekspor data ke CSV/Excel.

### 6.2 Integrasi Webhook Lynk.id (`/api/webhook/lynkid`)
* **Endpoint**: `https://[domain-aplikasi]/api/webhook/lynkid`
* **Metode**: `POST`
* **Format Payload**:
  ```json
  {
    "event": "order.completed",
    "order_id": "LYNK-ORD-98213",
    "customer_name": "Fatimah Azzahra",
    "customer_email": "fatimah@gmail.com",
    "product_name": "Paket VIP Ultimate + Lab",
    "amount": 149000,
    "status": "PAID"
  }
  ```
* **Mekanisme Otomatis**:
  Begitu pesanan lunas di Lynk.id, webhook ini seketika mendaftarkan email pembeli ke database whitelist dengan tier yang sesuai. Pengguna bisa langsung login di aplikasi dalam hitungan detik tanpa perlu konfirmasi manual admin.

---

## 7. Kebutuhan Non-Fungsional (NFR) & Performa

* **Kecepatan & Responsivitas (Zero Latency)**: Waktu render antar menu maksimal < 100ms. Perpindahan halaman instan tanpa animasi memantul (*bounce up*) yang memberatkan perangkat.
* **Offline-First Resilience**: Aplikasi dapat dibuka, dibaca, dan dicentang amalannya di tempat tanpa sinyal sekalipun (di dalam pesawat, kereta, atau ruangan kedap sinyal).
* **Kompatibilitas Lintas Perangkat**: Tampilan 100% responsif pada layar ponsel kecil (360px), smartphone standar (390px - 430px), tablet, hingga monitor desktop.
* **Efisiensi Memori & Baterai**: Animasi tasbih dan goyangan pendulum dijalankan via CSS GPU Transforms dengan beban CPU mendekati 0%. Audio synthesizer memakai Singleton Context yang tidak membebani kartu suara gawai.

---

## 8. Panduan Verifikasi & Rilis Produksi (Release Checklist)

- [x] **Lint & Type Check**: TypeScript 0 error (`tsc --noEmit` lolos 100%).
- [x] **Production Build**: Next.js Turbopack `npm run build` sukses di 18/18 rute.
- [x] **Dual Branch Git Push**: Seluruh perbaikan ter-commit dan ter-push sinkron ke branch `master` dan `main`.
- [x] **PWA Installability**: Manifest dan Service Worker terdaftar valid untuk instalasi di Android & iOS.
- [x] **Audio Reliability**: Suara klik aduan gelas kaca "ting-ting" teruji stabil pada lebih dari 1.000 ketukan berturut-turut.
- [x] **Dokumentasi Terpadu**: Tersinkronisasi penuh pada vault Obsidian internal dan eksternal.

---
*Dokumen PRD ini diterbitkan secara resmi sebagai blueprint pengembangan dan panduan operasional aplikasi Jalur Langit PWA.*
