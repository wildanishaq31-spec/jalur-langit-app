import { RoadmapFeatureItem } from '@/types';

export const ROADMAP_FEATURES: RoadmapFeatureItem[] = [
  {
    id: 'kiblat_adzan',
    title: 'Kompas Kiblat Presisi & Jadwal Adzan GPS',
    category: 'ibadah',
    status: 'segera_rilis',
    statusLabel: 'Segera Rilis • v1.3',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    progressPercent: 85,
    description: "Penunjuk arah Ka'bah secara real-time memanfaatkan sensor gyroscope & kompas perangkat, disertai perhitungan jadwal 5 waktu sholat akurat berbasis koordinat GPS lokal tanpa perlu input manual.",
    highlights: [
      'Sensor Kompas Gyro Real-Time Presisi',
      'Waktu Sholat 5 Waktu Akurat GPS Otomatis',
      'Pengingat Suara Adzan Merdu',
      'Dukungan Penuh Mode Offline'
    ],
    estimatedRelease: 'Desember 2026',
    iconName: 'Compass'
  },
  {
    id: 'rapor_pdf',
    title: 'Rapor Istiqomah 30 Hari & Ekspor PDF',
    category: 'produktivitas',
    status: 'dalam_pengerjaan',
    statusLabel: 'Sedang Dikembangkan',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/90 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    progressPercent: 68,
    description: 'Analisis mendalam konsistensi ibadah bulananmu. Evaluasi grafik persentase amalan langit, dan cetak lembar rapor evaluasi digital format PDF atau kartu infografis estetik untuk arsip pribadi.',
    highlights: [
      'Grafik Evaluasi Istiqomah Bulanan',
      'Ekspor Lembar Jurnal PDF Beresolusi Tinggi',
      'Kartu Ringkasan Prestasi Estetik Siap Share',
      'Rangkuman Target & Hajat Tercapai'
    ],
    estimatedRelease: 'Januari 2027',
    iconName: 'FileText'
  },
  {
    id: 'kalkulator_zakat',
    title: 'Kalkulator Zakat Mal, Profesi & Fidyah',
    category: 'finansial',
    status: 'tahap_riset',
    statusLabel: 'Tahap Desain & Fiqih',
    badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950/90 dark:text-sky-300 border-sky-300 dark:border-sky-700',
    progressPercent: 45,
    description: "Hitung kewajiban zakat dengan mudah dan tepat syar'i. Dilengkapi update otomatis nisab emas & perak terkini, konversi zakat profesi bulanan, tabungan, perdagangan, serta kalkulator fidyah puasa.",
    highlights: [
      'Perhitungan Nisab Emas & Perak Terkini',
      'Kalkulasi Zakat Profesi & Tabungan',
      'Hitung Fidyah & Kifarat Puasa',
      'Terhubung Langsung ke Catatan Sedekah'
    ],
    estimatedRelease: 'Februari 2027',
    iconName: 'Calculator'
  },
  {
    id: 'soundscape_murottal',
    title: 'Audio Murottal & Soundscape Dzikir Alami',
    category: 'audio',
    status: 'rencana',
    statusLabel: 'Rencana Pembaruan',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/90 dark:text-purple-300 border-purple-300 dark:border-purple-700',
    progressPercent: 30,
    description: 'Ruang audio relaksasi untuk menemani sesi wirid malam, sholat tahajjud, atau muhasabah. Paduan suara alam menenangkan (hujan rintik di fajar hari, desir angin malam) dipadukan lantunan murottal syahdu para qori pilihan.',
    highlights: [
      'Soundscape Alam Menenangkan (Hujan, Angin, Air)',
      'Murottal Juz 30 Offline Audio Player',
      'Timer Tidur Otomatis (Sleep Timer)',
      'Tersinkronisasi dengan Modul Tasbih'
    ],
    estimatedRelease: 'Maret 2027',
    iconName: 'Headphones'
  },
  {
    id: 'future_letters',
    title: 'Kapsul Waktu: Surat Harapan Masa Depan',
    category: 'doa',
    status: 'rencana',
    statusLabel: 'Konsep Eksplorasi',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/90 dark:text-rose-300 border-rose-300 dark:border-rose-700',
    progressPercent: 20,
    description: 'Tulis surat renungan, doa rahasia, dan impian untuk dirimu di masa mendatang (1, 2, atau 5 tahun ke depan). Surat ini akan terkunci rapat dan baru terbuka otomatis saat tanggal yang kamu tentukan tiba.',
    highlights: [
      'Enkripsi Surat Pribadi Terlindungi',
      'Kunci Otomatis hingga Tanggal Buka Tiba',
      'Refleksi Transformasi Diri & Jawaban Doa',
      'Arsip Rahasia Perjalanan Spiritual'
    ],
    estimatedRelease: 'April 2027',
    iconName: 'Mail'
  }
];
