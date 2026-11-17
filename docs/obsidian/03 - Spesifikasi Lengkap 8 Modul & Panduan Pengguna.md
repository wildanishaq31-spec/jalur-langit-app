---
title: "Spesifikasi Lengkap 8 Modul & Panduan Pengguna Jalur Langit"
date: 2026-11-17
category: "Spesifikasi Modul & Panduan"
tags:
  - obsidian-manual
  - jalur-langit
  - user-guide
  - spesifikasi-modul
  - tutorial-pwa
  - amalan-islam
---

# 📖 Spesifikasi Lengkap 8 Modul & Panduan Pengguna Jalur Langit

> [!tip] Buku Panduan Lengkap
> Dokumen ini menjelaskan fungsi rinci setiap modul, dalil/keutamaan amalan, alur kerja antar-fitur, dan panduan instalasi aplikasi di HP pengguna.

---

## 🌸 1. Modul Beranda & Real Calendar View (Januari – Desember)

### Fungsi & Deskripsi
Pusat navigasi dan pemantau kedisiplinan spiritual harian. Menggantikan lembar spreadsheet kalender 30 hari kaku menjadi **Kalender Masehi Dinamis 12 Bulan**:
* **Grid Kalender Penuh (Senin – Minggu)**: Menampilkan tanggal aktual dengan status persentase pencapaian.
* **Bar Progres Warna**: Setiap kotak tanggal memiliki bar mini yang terisi otomatis seiring pengguna mencentang amalan.
* **Penanda Hari Ini (*Today Glow Dot*)**: Memberi highlight lembut pada tanggal saat ini.
* **Pemilih Bulan Cepat**: Tombol panah kiri/kanan dan dropdown nama bulan untuk berpindah antar bulan dari Januari hingga Desember.
* **Kartu Ringkasan 6 Modul**:
  1. *Amalan*: Persentase checklist amalan hari ini.
  2. *Glow Up*: Jumlah gelas air (dari target 8 gelas) & status skincare.
  3. *Tasbih*: Jumlah dzikir yang telah dibaca hari ini.
  4. *Vision*: Jumlah impian aktif di Vision Board.
  5. *Hajat*: Jumlah doa hajat yang sedang dipanjatkan.
  6. *Quran*: Status tilawah juz hari ini.

---

## 🤲 2. Modul Amalan Jalur Langit + Jam HP Real-Time & Alarm

### Jendela Waktu & Amalan Utama
Aplikasi mengelompokkan amalan ke dalam 5 jendela waktu mustajab:

| Waktu | Rentang Jam | Amalan Utama | Dalil / Fadhilah |
| :--- | :---: | :--- | :--- |
| **Dini Hari** | 02:00 – 04:30 | • Sholat Tahajjud (min. 2 rakaat)<br>• Sholat Hajat<br>• Istighfar Sahur (100x)<br>• Sholat Witir | *"Dan pada sebagian malam, lakukanlah sholat tahajjud sebagai suatu ibadah tambahan bagimu; mudah-mudahan Tuhanmu mengangkatmu ke tempat yang terpuji."* (QS. Al-Isra: 79) |
| **Subuh** | 04:30 – 06:00 | • Sholat Qobliyah Subuh (2 rakaat)<br>• Sholat Subuh tepat waktu<br>• Dzikir Pagi<br>• Sedekah Subuh | *"Dua rakaat fajar (qobliyah subuh) lebih baik daripada dunia dan seisinya."* (HR. Muslim) |
| **Dhuha & Siang** | 06:00 – 15:00 | • Sholat Dhuha (4–8 rakaat)<br>• Sholat Dzuhur & Rawatib<br>• Bekerja/Belajar niat ibadah | *"Maka sholatlah empat rakaat di awal siang, niscaya Aku cukupkan kebutuhanmu pada akhir siang."* (HR. Abu Dawud) |
| **Petang** | 15:00 – 18:00 | • Sholat Ashar tepat waktu<br>• Dzikir Petang<br>• Membaca QS. Al-Waqi'ah | *"Barangsiapa membaca surat Al-Waqi'ah setiap malam, niscaya ia tidak akan ditimpa kemiskinan selamanya."* (HR. Baihaqi) |
| **Malam** | 18:00 – 02:00 | • Sholat Maghrib & Isya berjamaah<br>• Membaca QS. Al-Mulk<br>• Sholawat Nabi (100–1000x)<br>• Muhasabah & Wudhu sebelum tidur | *"Surat Al-Mulk adalah penghalang dan penyelamat dari siksa kubur."* (HR. Tirmidzi) |

### Fitur Jam HP & Alarm
* **Status Bar Terkini**: Jam HP dibaca secara langsung (`19:40 WIB`) dan mencocokkan waktu aktif dengan salah satu dari 5 jendela di atas.
* **Badge "Waktu Sekarang"**: Amalan yang relevan dengan jam saat ini otomatis disorot dengan bingkai emas berkedip lembut.
* **Pengaturan Alarm**: Pengguna dapat menyetel jam alarm spesifik di modal `[Atur Pengingat HP]`.
* **Audio Lonceng Lembut & Getaran**: Ketika jam menyentuh target, sistem membangkitkan nada alunan 3-nada (*E5 ➔ B5 ➔ E6*) via Web Audio API serta getaran HP, disertai banner push notification.

---

## 📿 3. Modul Tasbih Digital Multi-Tahap (Sequential 33-33-33)

### Alur Kerja Wirid Sholat
Wirid tasbih selepas sholat fardhu dirancang mengikuti tuntunan sunnah yang presisi:
1. **Langkah 1: Subhanallah (سُبْحَانَ اللَّهِ)**
   - Layar menampilkan kaligrafi Arab dan teks latin *"Subhanallah"*.
   - Tombol ketuk lingkaran bergetar lembut setiap sentuhan.
   - Counter bergerak dari `0` menuju `33`.
   - Saat menyentuh `33`: Muncul efek konfirmasi, lonceng berdentang, **angka tampilan otomatis kembali ke 0**, dan teks langsung berganti ke langkah berikutnya.
2. **Langkah 2: Alhamdulillah (اَلْحَمْدُ لِلَّهِ)**
   - Layar menampilkan *"Alhamdulillah"*.
   - Counter bergerak dari `0` menuju `33`.
   - Saat menyentuh `33`: Tampilan kembali reset ke 0 dan beralih ke langkah ketiga.
3. **Langkah 3: Allahu Akbar (اَللَّهُ أَكْبَرُ)**
   - Layar menampilkan *"Allahu Akbar"*.
   - Counter bergerak dari `0` menuju `33`.
   - Saat menyentuh `33`: **Selebrasi tuntas!** Hujan konfeti (*canvas-confetti*), getaran selebrasi, dan data capaian tersimpan ke riwayat tanggal hari ini.

### Dzikir Populer Lainnya
Disediakan tombol jalan pintas untuk dzikir intensif Jalur Langit:
* **Sholawat Jibril (1000x)**: *Shallallahu 'ala Muhammad*
* **Istighfar Taubat (1000x)**: *Astaghfirullahal 'adzim wa atubu ilaih*
* **Doa Nabi Yunus (100x)**: *La ilaha illa Anta subhanaka inni kuntu minazh-zhalimin*
* **Hauqalah (100x)**: *La hawla wa la quwwata illa billahil 'aliyyil 'azhim*
* **Pilihan Target Cepat**: `33x`, `100x`, `500x`, `1000x`, atau `Edit Target Khusus`.

---

## ✨ 4. Modul Glow Up Habits & Self-Care Muslimah

Mengadopsi konsep *"That Girl Muslimah"* yang menyeimbangkan kecantikan spiritual, kesehatan fisik, dan kestabilan mental:
* **Tracker Air Minum 2 Liter (8 Gelas)**: 8 ikon gelas interaktif yang bisa diketuk satu per satu hingga mencapai target hidrasi 2000 ml.
* **Routine Checklist**:
  - Morning Skincare (Cleanser, Sunscreen, Pelembab).
  - Night Skincare (Double cleansing, Serum, Moisturizer).
  - Workout / Stretching ringan 30 Menit.
  - Membaca buku positif 15 Menit.
  - Istirahat tidur cukup 7 Jam.
  - Pola makan sehat halal & thayyib.
* **Mood Tracker Interaktif**: Pilihan 5 ekspresi suasana hati harian: Bersyukur (*Grateful*), Bahagia (*Happy*), Damai (*Peaceful*), Lelah (*Tired*), atau Sedih (*Sad*).
* **Brain Dump Journal**: Ruang catatan bebas untuk menuangkan rasa gundah, ide kreatif, atau isi kepala sebelum tidur agar tidur lebih tenang (*peace of mind*).

---

## 🎯 5. Modul Vision Board & Manifestasi Islami

* **Papan Kartu Visual Impian**: Menampilkan foto impian resolusi tinggi dengan kategori (Spiritual, Karier, Finansial, Keluarga, Kesehatan). Dilengkapi tombol centang ketika impian telah dikabulkan Allah.
* **Afirmasi Positif Islami**: Kalimat afirmasi berbasis prasangka baik kepada Allah (*Husnudzon billah*) dengan tombol *Randomizer* inspirasi harian.
* **Surat untuk Diri di Masa Depan (*Letter to Future Self*)**: Fitur menulis surat refleksi yang disegel dengan tanggal buka di masa depan (misal: dibuka 1 tahun lagi).

---

## 🤲 6. Modul Papan Hajat & Sedekah Subuh

* **Manajemen Doa Hajat**:
  - Mencatat hajat besar (misal: lulus ujian, melunasi amanah utang, jodoh terbaik, kesembuhan keluarga).
  - 3 Tingkatan Status: **Dalam Doa 🤲**, **Sedang Diikhtiarkan ⚡**, atau **Terkabul / Alhamdulillah 🎉**.
* **Tracker Sedekah Subuh Rupiah**:
  - Input tanggal, nominal rupiah (Rp), tujuan sedekah, dan niat/doa khusus yang dipanjatkan bersama sedekah tersebut.
  - Kartu total akumulasi sedekah yang telah dikeluarkan sepanjang tantangan.

---

## 📖 7 & 8. Modul Quran: 1 Day 1 Juz, Tadabbur 4-Pilar, & Kajian

### Tilawah 1 Day 1 Juz
* Grid 30 Juz interaktif untuk memantau perjalanan khatam 30 hari.
* Setiap juz dapat dicentang saat tuntas dibaca, dilengkapi bar capaian menuju khatam.

### Tadabbur Al-Qur'an 4 Pilar (Berdasarkan Template Spreadsheet Lynk.id)
Bukan sekadar membaca lafadz, modul ini memandu perenungan ayat mendalam:
1. **Pilar 1 — Kisah & Sebab Turunnya (*Asbabun Nuzul*)**: Mengetahui latar belakang sejarah ayat.
2. **Pilar 2 — Topik Utama**: Menangkap pesan inti yang difirmankan Allah.
3. **Pilar 3 — Hikmah & Renungan Diri**: Menghubungkan teguran atau janji ayat dengan kehidupan pribadi.
4. **Pilar 4 — Rencana Aksi Nyata Hari Ini**: Perilaku konkret yang akan diubah setelah membaca ayat tersebut.

### 1 Day 1 Kajian & Daily Gratitude
* Catatan ringkasan ceramah/kajian harian: tema kajian, nama ustadz/penceramah, link YouTube/audio, serta 3 poin hikmah terpenting.
* Jurnal rasa syukur harian (*Daily Gratitude*): 3 hal yang paling disyukuri hari ini.

---

## 🎨 Dual Theme: Blush Rose 🌸 vs Emerald Sage 🌿

Pengguna dapat mengganti tema secara instan melalui tombol switch di pojok kanan atas:
* **Tema Blush Rose 🌸**: Latar lembut nuansa merah muda pastel, peach, dan rose gold yang feminin dan menenangkan.
* **Tema Emerald Sage 🌿**: Latar elegan nuansa hijau zamrud Islami, teal, dan aksen emas (*gold accents*) yang agung dan sejuk di mata.

---

## 📲 Panduan Instalasi Aplikasi di HP (PWA - Add to Home Screen)

Aplikasi dibangun sebagai Progressive Web App penuh. Pengguna tidak perlu mengunduh file APK berukuran besar:
1. Hubungkan HP ke jaringan Wi-Fi yang sama dengan laptop, lalu buka IP laptop di browser HP: `http://<IP-LAPTOP>:3005`.
2. **Di Google Chrome (Android)**:
   - Ketuk menu titik tiga (⋮) di pojok kanan atas.
   - Pilih menu **"Tambahkan ke Layar Utama" / "Install App"**.
   - Aplikasi akan langsung terpasang di layar menu HP dengan ikon kubah emas yang elegan dan dapat dibuka dalam mode layar penuh (*standalone*).
3. **Di Safari (iPhone / iOS)**:
   - Ketuk ikon **Bagikan (Share)** di bilah bawah.
   - Gulir ke bawah dan pilih **"Tambah ke Layar Utama" (Add to Home Screen)**.

---
> Berkas panduan ini siap dibaca dan dieksplorasi kapan saja di dalam Obsidian.
