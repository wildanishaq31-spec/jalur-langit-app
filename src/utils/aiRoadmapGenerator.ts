// src/utils/aiRoadmapGenerator.ts
// Engine Asisten AI Perancang Inovasi & Roadmap Cerdas Jalur Langit
// Menghasilkan konsep fitur, deskripsi bernilai konversi tinggi, poin keunggulan, dan milestone SDLC

import { FeatureStatus, RoadmapMilestone } from '@/types';

export interface GeneratedRoadmapIdea {
  title: string;
  category: 'ibadah' | 'produktivitas' | 'audio' | 'finansial' | 'doa';
  iconName: 'Compass' | 'FileText' | 'Calculator' | 'Headphones' | 'Mail' | 'Sparkles';
  status: FeatureStatus;
  statusLabel: string;
  badgeColor: string;
  targetRelease: string;
  description: string;
  highlights: string[];
  milestones: RoadmapMilestone[];
  progressPercent: number;
}

// 20+ Pustaka Ide Inovasi Terkurasi Bernilai Tinggi untuk Ekosistem Jalur Langit
export const CURATED_AI_INNOVATIONS: GeneratedRoadmapIdea[] = [
  // Kategori: IBADAH
  {
    title: 'Pelacak Konsistensi Sholat Berjamaah 40 Hari',
    category: 'ibadah',
    iconName: 'Sparkles',
    status: 'tahap_riset',
    statusLabel: 'Tahap Riset & Fiqih',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
    targetRelease: 'April 2027',
    description: 'Program pembiasaan 40 hari sholat fardhu berjamaah di masjid tepat waktu tanpa tertinggal takbiratul ula, mengacu hadits pembebasan dari api neraka dan sifat nifaq.',
    highlights: [
      'Pencatatan 40 hari takbiratul ula berturut-turut tanpa jeda',
      'Pengingat GPS masjid terdekat & jadwal iqomah presisi',
      'Grafik istiqomah bulanan & sertifikat apresiasi digital',
      'Dukungan mode darurat jika ada udzur syar\'i yang sah'
    ],
    milestones: [
      { id: 'm1', title: 'Riset Hadits 40 Hari & Validasi Fiqih Sholat Berjamaah', percentageWeight: 20, isCompleted: true },
      { id: 'm2', title: 'Desain Antarmuka Streak Counter 40 Hari & Peringkat', percentageWeight: 25, isCompleted: false },
      { id: 'm3', title: 'Implementasi Algoritma Deteksi GPS Masjid & Pengingat', percentageWeight: 30, isCompleted: false },
      { id: 'm4', title: 'Uji Coba Beta Skenario Udzur Syar\'i & Reset Streak', percentageWeight: 15, isCompleted: false },
      { id: 'm5', title: 'Peluncuran Resmi ke Seluruh Pengguna Jalur Langit', percentageWeight: 10, isCompleted: false }
    ],
    progressPercent: 20
  },
  {
    title: 'Kalender Puasa Sunnah & Pengingat Ayyamul Bidh',
    category: 'ibadah',
    iconName: 'Compass',
    status: 'tahap_riset',
    statusLabel: 'Tahap Desain UX',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
    targetRelease: 'Maret 2027',
    description: 'Kalender terintegrasi yang menandai puasa Senin-Kamis, Ayyamul Bidh (13, 14, 15 Hijriyah), puasa Daud, dan puasa Asyura dengan notifikasi sahur otomatis.',
    highlights: [
      'Sinkronisasi kalender Hijriyah Ummul Qura akurat',
      'Notifikasi niat puasa malam hari & bangun sahur otomatis',
      'Kumpulan doa mustajab menjelang waktu berbuka puasa',
      'Pencatat hutang puasa Ramadhan (qadha) dengan target lunas'
    ],
    milestones: [
      { id: 'm1', title: 'Riset Algoritma Konversi Penanggalan Hijriyah Presisi', percentageWeight: 20, isCompleted: true },
      { id: 'm2', title: 'Desain Layout Kalender Visual Puasa & Badge Hari', percentageWeight: 25, isCompleted: false },
      { id: 'm3', title: 'Implementasi Notifikasi Sahur & Pengingat Buka Puasa', percentageWeight: 30, isCompleted: false },
      { id: 'm4', title: 'Integrasi dengan Modul Catatan Amalan Harian', percentageWeight: 15, isCompleted: false },
      { id: 'm5', title: 'Rilis Publik Fitur Kalender Puasa Sunnah Terpadu', percentageWeight: 10, isCompleted: false }
    ],
    progressPercent: 20
  },
  {
    title: 'Checklist 12 Rakaat Sholat Rawatib Pembangun Istana Surga',
    category: 'ibadah',
    iconName: 'Sparkles',
    status: 'rencana',
    statusLabel: 'Rencana Pembaruan',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
    targetRelease: 'Mei 2027',
    description: 'Panduan dan tracker khusus untuk menjaga 12 rakaat sholat sunnah rawatib mu\'akkadah setiap hari: 2 rakaat sebelum Subuh, 4 sebelum Dzuhur, 2 sesudah Dzuhur, 2 sesudah Maghrib, dan 2 sesudah Isya.',
    highlights: [
      'Visualisasi istana surga yang terisi batu bata emas setiap 12 rakaat',
      'Pengingat otomatis sebelum adzan & sesudah sholat fardhu',
      'Tabel rekap konsistensi mingguan & evaluasi sholat sunnah',
      'Panduan niat dan keutamaan masing-masing sholat rawatib'
    ],
    milestones: [
      { id: 'm1', title: 'Riset Matan Hadits Rawatib & Konsep Gamifikasi Istana Surga', percentageWeight: 20, isCompleted: false },
      { id: 'm2', title: 'Desain Visual Istana Surga Interaktif & Indikator Rakaat', percentageWeight: 25, isCompleted: false },
      { id: 'm3', title: 'Koding Logika Perhitungan Rawatib & Logika Persistensi', percentageWeight: 30, isCompleted: false },
      { id: 'm4', title: 'Pengujian Notifikasi Real-time & Kompatibilitas Perangkat', percentageWeight: 15, isCompleted: false },
      { id: 'm5', title: 'Peluncuran Modul Rawatib Tracker ke Seluruh Pengguna', percentageWeight: 10, isCompleted: false }
    ],
    progressPercent: 0
  },

  // Kategori: AUDIO & RELAKSASI
  {
    title: 'Ruqyah Syar\'iyyah Mandiri & Audio Penenang Kecemasan',
    category: 'audio',
    iconName: 'Headphones',
    status: 'tahap_riset',
    statusLabel: 'Tahap Kurasi Audio',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
    targetRelease: 'April 2027',
    description: 'Koleksi audio murottal ayat-ayat ruqyah syar\'iyyah penawar penyakit ain, sihir, depresi batin, dan gangguan was-was dengan kualitas studio dan dukungan offline.',
    highlights: [
      'Ayat-ayat ruqyah terstandar bersanad (Al-Fatihah, Kursi, Al-Baqarah, 3 Qul)',
      'Panduan tata cara ruqyah mandiri sesuai sunnah Nabi SAW',
      'Timer tidur otomatis (Auto Sleep 15, 30, 60 menit)',
      'Dukungan pemutaran di latar belakang layar mati tanpa internet'
    ],
    milestones: [
      { id: 'm1', title: 'Kurasi Rekaman Murottal Ruqyah Audio Kualitas Studio', percentageWeight: 20, isCompleted: true },
      { id: 'm2', title: 'Desain Audio Player Minimalis dengan Visual Gelombang Hening', percentageWeight: 25, isCompleted: false },
      { id: 'm3', title: 'Implementasi Web Audio API & Service Worker Cache Offline', percentageWeight: 30, isCompleted: false },
      { id: 'm4', title: 'Uji Coba Background Playback di Browser HP & iOS Safari', percentageWeight: 15, isCompleted: false },
      { id: 'm5', title: 'Rilis Ruang Audio Ruqyah Syar\'iyyah Mandiri', percentageWeight: 10, isCompleted: false }
    ],
    progressPercent: 20
  },
  {
    title: 'Soundscape Fajar & Gemericik Air Wudhu Penenang Tahajjud',
    category: 'audio',
    iconName: 'Headphones',
    status: 'rencana',
    statusLabel: 'Rencana Pembaruan',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
    targetRelease: 'Juni 2027',
    description: 'Suasana suara alam fajar yang menentramkan: gemericik tetesan air wudhu, hembusan angin sejuk sepertiga malam, dan suara jangkrik malam untuk menemani wirid tahajjud.',
    highlights: [
      'Campuran 6 layer suara alam berkualitas tinggi bebas bising',
      'Pengatur volume tiap elemen suara (atur air, angin, dan murottal)',
      'Mode khusus konsentrasi dzikir malam bebas distraksi visual',
      'Dapat digabungkan dengan lantunan tasbih digital 3D'
    ],
    milestones: [
      { id: 'm1', title: 'Perekaman Suara Atmosferik Fajar & Lisensi Audio Berkualitas', percentageWeight: 20, isCompleted: false },
      { id: 'm2', title: 'Desain Sound Mixer Interaktif Multitrack', percentageWeight: 25, isCompleted: false },
      { id: 'm3', title: 'Koding Audio Synthesis & Kontrol Volume Masing-Masing Track', percentageWeight: 30, isCompleted: false },
      { id: 'm4', title: 'Pengujian Penggunaan Baterai & Efisiensi Memori Ponsel', percentageWeight: 15, isCompleted: false },
      { id: 'm5', title: 'Peluncuran Soundscape Suasana Sepertiga Malam', percentageWeight: 10, isCompleted: false }
    ],
    progressPercent: 0
  },

  // Kategori: FINANSIAL SYARIAH
  {
    title: 'Dompet Barakah: Tabungan Qurban & Impian Umroh',
    category: 'finansial',
    iconName: 'Calculator',
    status: 'tahap_riset',
    statusLabel: 'Tahap Kalkulasi Fiqih',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
    targetRelease: 'Mei 2027',
    description: 'Rencana tabungan cerdas terarah untuk mewujudkan ibadah Qurban tahunan atau perjalanan suci Umroh dengan kalkulator setoran harian/mingguan yang realistis.',
    highlights: [
      'Simulasi hitung setoran harian/mingguan otomatis sesuai target',
      'Indikator persentase capaian menuju Baitullah & hewan qurban',
      'Pengingat nabung harian terhubung ke amalan sedekah subuh',
      'Arsip mutasi tabungan pribadi tanpa perlu koneksi bank luar'
    ],
    milestones: [
      { id: 'm1', title: 'Riset Estimasi Harga Qurban & Paket Umroh Rata-Rata', percentageWeight: 20, isCompleted: true },
      { id: 'm2', title: 'Desain Visual Dompet Impian & Milestone Tabungan', percentageWeight: 25, isCompleted: false },
      { id: 'm3', title: 'Implementasi Mesin Kalkulator Cicilan Nabung Fleksibel', percentageWeight: 30, isCompleted: false },
      { id: 'm4', title: 'Integrasi dengan Log Sedekah Subuh di Hajat & Sedekah', percentageWeight: 15, isCompleted: false },
      { id: 'm5', title: 'Peluncuran Resmi Modul Tabungan Barakah Umroh & Qurban', percentageWeight: 10, isCompleted: false }
    ],
    progressPercent: 20
  },
  {
    title: 'Kalkulator Faraidh & Pembagian Waris Syar\'i Otomatis',
    category: 'finansial',
    iconName: 'Calculator',
    status: 'rencana',
    statusLabel: 'Eksplorasi Syariat',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
    targetRelease: 'Juli 2027',
    description: 'Sistem komputasi pembagian harta warisan secara syariat Islam berdasarkan Al-Qur\'an (Surat An-Nisa), menentukan bagian ahli waris ashabah dan dzawil furudh dengan presisi.',
    highlights: [
      'Kalkulasi otomatis porsi hak ahli waris (ayah, ibu, anak, istri, suami)',
      'Penjelasan dalil ayat Al-Qur\'an & hadits untuk tiap porsi pembagian',
      'Diagram lingkaran visual persentase pembagian harta warisan',
      'Ekspor lembar ringkasan pembagian waris ke format dokumen PDF'
    ],
    milestones: [
      { id: 'm1', title: 'Studi Fiqih Mawaris 4 Mazhab & Logika Cabang Ahli Waris', percentageWeight: 20, isCompleted: false },
      { id: 'm2', title: 'Desain Antarmuka Wizard Pemilihan Anggota Keluarga Ahli Waris', percentageWeight: 25, isCompleted: false },
      { id: 'm3', title: 'Koding Algoritma Faraidh (Ashabah, Hijab Nuqsan & Hirman)', percentageWeight: 30, isCompleted: false },
      { id: 'm4', title: 'Validasi Perhitungan dengan Ustadz & Pakar Fiqih Muamalah', percentageWeight: 15, isCompleted: false },
      { id: 'm5', title: 'Peluncuran Modul Faraidh & Edukasi Waris Syar\'i', percentageWeight: 10, isCompleted: false }
    ],
    progressPercent: 0
  },

  // Kategori: PRODUKTIVITAS MUSLIMAH
  {
    title: 'Jurnal Muhasabah Malam & Terapi Zero Grievance',
    category: 'produktivitas',
    iconName: 'FileText',
    status: 'dalam_pengerjaan',
    statusLabel: 'Sedang Dikembangkan',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
    targetRelease: 'Februari 2027',
    description: 'Lembar evaluasi batin 3 menit sebelum tidur: mencatat dosa yang dimohonkan ampun, nikmat kecil yang disyukuri, dan memaafkan semua orang agar tidur dalam kondisi hati bersih.',
    highlights: [
      '3 Pertanyaan terstruktur penata jiwa sebelum memejamkan mata',
      'Fitur maafkan semua orang sebelum tidur sesuai sunnah Rasulullah',
      'Catatan rasa syukur tersimpan dengan enkripsi keamanan pribadi',
      'Ringkasan perkembangan kedamaian batin bulanan'
    ],
    milestones: [
      { id: 'm1', title: 'Riset Konsep Terapi Tazkiyatun Nafs & Zero Grievance', percentageWeight: 20, isCompleted: true },
      { id: 'm2', title: 'Desain Lembar Jurnal Refleksi Bernuansa Hening & Damai', percentageWeight: 25, isCompleted: true },
      { id: 'm3', title: 'Koding Penyimpanan Terenkripsi & Sistem Checkpoint Malam', percentageWeight: 30, isCompleted: false },
      { id: 'm4', title: 'Uji Coba Kenyamanan Mengetik & Notifikasi Hening Malam', percentageWeight: 15, isCompleted: false },
      { id: 'm5', title: 'Rilis Fitur Muhasabah Malam ke Publik', percentageWeight: 10, isCompleted: false }
    ],
    progressPercent: 45
  },
  {
    title: 'Smart Habit Khatam Quran 30 Hari & Multi-Juz Planner',
    category: 'produktivitas',
    iconName: 'FileText',
    status: 'tahap_riset',
    statusLabel: 'Tahap Wireframe UX',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
    targetRelease: 'Ramadhan 2027',
    description: 'Pembimbing tilawah terstruktur untuk menyelesaikan 30 juz Al-Qur\'an dalam 30 hari (atau 15 hari) dengan pembagian lembar per sholat fardhu dan pelacak ayat terakhir.',
    highlights: [
      'Pembagian takaran tilawah (2 lembar ba\'da tiap sholat fardhu = 1 juz/hari)',
      'Penanda pita digital juz & halaman terakhir yang dibaca',
      'Statistik kecepatan tilawah & estimasi tanggal khatam presisi',
      'Doa khatam Al-Qur\'an terjemahan lengkap siap dilafadzkan'
    ],
    milestones: [
      { id: 'm1', title: 'Riset Pola Tilawah Terbaik Menjelang Bulan Ramadhan', percentageWeight: 20, isCompleted: true },
      { id: 'm2', title: 'Desain Antarmuka Visual 30 Kotak Juz & Bookmark Pita', percentageWeight: 25, isCompleted: false },
      { id: 'm3', title: 'Integrasi dengan Modul Quran Journal & Halaman /quran', percentageWeight: 30, isCompleted: false },
      { id: 'm4', title: 'Pengujian Penghitungan Estimasi Khatam & Reminder Sholat', percentageWeight: 15, isCompleted: false },
      { id: 'm5', title: 'Peluncuran Edisi Khusus Menyambut Ramadhan Mulia', percentageWeight: 10, isCompleted: false }
    ],
    progressPercent: 20
  },

  // Kategori: DOA & HAJAT
  {
    title: 'Kamus 100 Doa Mustajab Para Nabi & Asmaul Husna',
    category: 'doa',
    iconName: 'Mail',
    status: 'tahap_riset',
    statusLabel: 'Tahap Kurasi Dalil',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
    targetRelease: 'Maret 2027',
    description: 'Ensiklopedi doa-doa pilihan dari Al-Qur\'an dan hadits shahih yang dilafadzkan para nabi saat menghadapi ujian berat (Nabi Yunus, Nabi Ayyub, Nabi Musa, Nabi Zakariya).',
    highlights: [
      'Teks Arab tajwid warna, transliterasi latin, dan arti mendalam',
      'Penjelasan asbabun nuzul kisah di balik terkabulnya doa para nabi',
      'Pencarian cerdas berdasarkan kondisi hati (sedih, terlilit hutang, sakit)',
      'Simpan doa favorit ke daftar munajat harian dengan 1-klik'
    ],
    milestones: [
      { id: 'm1', title: 'Kurasi 100 Teks Doa dari Kitab Hadits & Tafsir Al-Qur\'an', percentageWeight: 20, isCompleted: true },
      { id: 'm2', title: 'Desain Kartu Doa Estetis Siap Bagikan (Shareable Quote)', percentageWeight: 25, isCompleted: false },
      { id: 'm3', title: 'Koding Mesin Pencarian Semantik Kategori Kebutuhan Batin', percentageWeight: 30, isCompleted: false },
      { id: 'm4', title: 'Integrasi Audio Pelafalan Tartil Doa Bersuara Jernih', percentageWeight: 15, isCompleted: false },
      { id: 'm5', title: 'Peluncuran Kamus 100 Doa Para Nabi ke Aplikasi PWA', percentageWeight: 10, isCompleted: false }
    ],
    progressPercent: 20
  },
  {
    title: 'Panduan Sholat Istikharah & Catatan Ketetapan Hati',
    category: 'doa',
    iconName: 'Mail',
    status: 'rencana',
    statusLabel: 'Rencana Pembaruan',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
    targetRelease: 'Agustus 2027',
    description: 'Modul pendamping saat menghadapi pilihan krusial (jodoh, karir, bisnis, atau pendidikan) dengan panduan tata cara sholat Istikharah dan pencatat isyarat kemantapan hati.',
    highlights: [
      'Panduan lengkap rukun sholat istikharah dan bacaan doa ma\'tsur',
      'Pencatat kronologi peristiwa dan ketenangan batin pasca istikharah',
      'Tips memahami tanda petunjuk Allah yang sering disalahartikan',
      'Privasi catatan rahasia keputusan hidup dengan sandi proteksi'
    ],
    milestones: [
      { id: 'm1', title: 'Riset Fiqih Istikharah & Pemahaman Tanda Kemudahan Takdir', percentageWeight: 20, isCompleted: false },
      { id: 'm2', title: 'Desain Lembar Keputusan Hidup & Skala Kemantapan Batin', percentageWeight: 25, isCompleted: false },
      { id: 'm3', title: 'Koding Fitur Diary Istikharah & Pengunci Keamanan PIN', percentageWeight: 30, isCompleted: false },
      { id: 'm4', title: 'Uji Kenyamanan Penggunaan pada Kasus Pilihan Nyata', percentageWeight: 15, isCompleted: false },
      { id: 'm5', title: 'Peluncuran Modul Istikharah & Ketetapan Takdir', percentageWeight: 10, isCompleted: false }
    ],
    progressPercent: 0
  }
];

/**
 * Mengambil ide inovasi acak dari bank ide cerdas
 */
export function getRandomAIInnovation(category?: string): GeneratedRoadmapIdea {
  let pool = CURATED_AI_INNOVATIONS;
  if (category && category !== 'all') {
    pool = CURATED_AI_INNOVATIONS.filter((item) => item.category === category);
    if (pool.length === 0) pool = CURATED_AI_INNOVATIONS;
  }
  const randomIndex = Math.floor(Math.random() * pool.length);
  return { ...pool[randomIndex] };
}

/**
 * Menghasilkan inovasi lengkap berdasarkan kata kunci prompt pengguna
 */
export function generateInnovationFromPrompt(prompt: string): GeneratedRoadmapIdea {
  const clean = prompt.trim().toLowerCase();

  // 1. Coba cocokkan dengan kata kunci di database terkurasi
  const matched = CURATED_AI_INNOVATIONS.find((item) => {
    return (
      item.title.toLowerCase().includes(clean) ||
      item.description.toLowerCase().includes(clean) ||
      item.highlights.some((h) => h.toLowerCase().includes(clean))
    );
  });

  if (matched && clean.length > 2) {
    return { ...matched };
  }

  // 2. Jika tidak ada yang cocok persis, sintesis inovasi baru secara cerdas
  let inferredCategory: 'ibadah' | 'produktivitas' | 'audio' | 'finansial' | 'doa' = 'ibadah';
  let inferredIcon: 'Compass' | 'FileText' | 'Calculator' | 'Headphones' | 'Mail' | 'Sparkles' = 'Sparkles';

  if (clean.includes('suara') || clean.includes('audio') || clean.includes('murottal') || clean.includes('tidur') || clean.includes('lagu') || clean.includes('musik')) {
    inferredCategory = 'audio';
    inferredIcon = 'Headphones';
  } else if (clean.includes('uang') || clean.includes('tabung') || clean.includes('zakat') || clean.includes('sedekah') || clean.includes('qurban') || clean.includes('harta') || clean.includes('waris') || clean.includes('fidyah')) {
    inferredCategory = 'finansial';
    inferredIcon = 'Calculator';
  } else if (clean.includes('doa') || clean.includes('hajat') || clean.includes('curhat') || clean.includes('surat') || clean.includes('harapan')) {
    inferredCategory = 'doa';
    inferredIcon = 'Mail';
  } else if (clean.includes('jurnal') || clean.includes('catat') || clean.includes('kebiasaan') || clean.includes('habit') || clean.includes('target') || clean.includes('rapor') || clean.includes('jadwal')) {
    inferredCategory = 'produktivitas';
    inferredIcon = 'FileText';
  } else {
    inferredCategory = 'ibadah';
    inferredIcon = 'Compass';
  }

  const capitalizedPrompt = prompt.trim().charAt(0).toUpperCase() + prompt.trim().slice(1);
  const synthesizedTitle = capitalizedPrompt.length > 4 ? `Sistem Cerdas ${capitalizedPrompt}` : `Inovasi Baru ${capitalizedPrompt}`;

  return {
    title: synthesizedTitle,
    category: inferredCategory,
    iconName: inferredIcon,
    status: 'tahap_riset',
    statusLabel: 'Tahap Riset & Spesifikasi',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
    targetRelease: 'Tahun 2027',
    description: `Pengembangan fitur inovatif berfokus pada ${prompt.trim()} yang dirancang untuk mendukung ikhtiar bumi dan langit pengguna Jalur Langit dengan antarmuka modern dan interaktif.`,
    highlights: [
      `Fitur terintegrasi otomatis dengan modul ${inferredCategory.toUpperCase()} di Jalur Langit`,
      `Antarmuka ramah pengguna (user-friendly) dengan dukungan mode offline penuh`,
      `Pengingat terjadwal dan pelacakan progres capaian harian`,
      `Keamanan data lokal terproteksi langsung di perangkat pengguna`
    ],
    milestones: [
      { id: 'm1', title: `Riset Spesifikasi & Kebutuhan Fitur ${capitalizedPrompt}`, percentageWeight: 20, isCompleted: true },
      { id: 'm2', title: 'Desain Antarmuka Estetis & Alur Pengalaman Pengguna (UX)', percentageWeight: 25, isCompleted: false },
      { id: 'm3', title: 'Implementasi Koding Komponen & Penyimpanan State Lokal', percentageWeight: 30, isCompleted: false },
      { id: 'm4', title: 'Pengujian Mutu (QA), Kasus Ekstrem & Beta Test', percentageWeight: 15, isCompleted: false },
      { id: 'm5', title: 'Peluncuran Resmi & Dokumentasi Panduan Pengguna', percentageWeight: 10, isCompleted: false }
    ],
    progressPercent: 20
  };
}

/**
 * Menghasilkan 4 poin keunggulan fitur secara otomatis berdasarkan judul dan kategori
 */
export function generateSmartHighlights(title: string, category: string): string[] {
  const clean = title.trim().toLowerCase();

  if (clean.includes('puasa')) {
    return [
      'Sinkronisasi kalender Hijriyah Ummul Qura akurat',
      'Notifikasi pengingat sahur & doa mustajab menjelang berbuka',
      'Hitung akumulasi hari puasa yang telah dituntaskan',
      'Dukungan panduan niat dan keutamaan amalan puasa sunnah'
    ];
  }

  if (clean.includes('sholat') || clean.includes('adzan') || clean.includes('rawatib')) {
    return [
      'Perhitungan waktu akurat berbasis koordinat GPS perangkat',
      'Pengingat adzan otomatis dengan pilihan nada lembut',
      'Checklist rakaat otomatis tersambung ke Rapor Amalan',
      'Dukungan penuh saat perangkat sedang dalam mode offline'
    ];
  }

  if (clean.includes('audio') || clean.includes('murottal') || clean.includes('dzikir') || clean.includes('ruqyah')) {
    return [
      'Kualitas audio jernih studio tanpa jeda (seamless looping)',
      'Timer tidur otomatis (Auto-Sleep) hemat daya baterai',
      'Dapat diputar di latar belakang saat layar ponsel mati',
      'Tersimpan aman di cache offline tanpa memakan kuota internet'
    ];
  }

  if (clean.includes('zakat') || clean.includes('uang') || clean.includes('tabung') || clean.includes('qurban') || clean.includes('waris')) {
    return [
      'Kalkulasi otomatis sesuai kaidah fiqih muamalah kontemporer',
      'Simulasi target dana berkala harian, mingguan, dan bulanan',
      'Visualisasi progres pencapaian dana menuju target impian',
      'Ekspor riwayat dan lembar bukti pembagian ke format dokumen'
    ];
  }

  if (clean.includes('quran') || clean.includes('juz') || clean.includes('tilawah') || clean.includes('hafal')) {
    return [
      'Target lembar bertahap per sholat fardhu agar tidak terasa berat',
      'Penanda pita digital halaman dan juz terakhir yang dibaca',
      'Statistik kecepatan tilawah & perkiraan waktu khatam presisi',
      'Dilengkapi doa khatam Al-Qur\'an berfaedah agung'
    ];
  }

  // Fallback berdasarkan kategori
  switch (category) {
    case 'audio':
      return [
        'Kualitas rekaman audio studio yang jernih dan menentramkan',
        'Pengatur waktu tidur otomatis (Auto Sleep Timer)',
        'Dukungan pemutaran offline tanpa ketergantungan internet',
        'Integrasi langsung dengan modul Dzikir & Tasbih Digital'
      ];
    case 'finansial':
      return [
        'Perhitungan matematis akurat sesuai syariat Islam',
        'Pencatatan mutasi mandiri tanpa meminta akses rekening pribadi',
        'Visualisasi grafik persentase capaian target keuangan berkah',
        'Terhubung langsung dengan catatan sedekah subuh harian'
      ];
    case 'doa':
      return [
        'Dilengkapi teks Arab bertanda baca jelas, latin, dan terjemahan',
        'Keterangan riwayat hadits shahih & waktu mustajab pengabulan',
        'Fitur simpan ke daftar munajat favorit dengan 1-klik',
        'Pemberitahuan hening pengingat doa di waktu mustajab'
      ];
    case 'produktivitas':
      return [
        'Pelacakan kebiasaan bertahap dengan statistik perkembangan',
        'Antarmuka bersih bebas gangguan yang nyaman dipandang',
        'Penyimpanan lokal terlindungi dengan enkripsi data aman',
        'Kompilasi ringkasan evaluasi mingguan dan bulanan'
      ];
    default:
      return [
        'Fitur terintegrasi otomatis dengan ekosistem Jalur Langit',
        'Antarmuka responsif ramah pengguna dengan tampilan estetis',
        'Dukungan penuh mode offline tanpa memerlukan internet',
        'Pencatat riwayat aktivitas yang tersimpan aman di perangkat'
      ];
  }
}
