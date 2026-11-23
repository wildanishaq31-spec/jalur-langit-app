import { RoadmapFeatureItem, RoadmapMilestone, FeatureStatus } from '@/types';

export const DEFAULT_ROADMAP_MILESTONES: RoadmapMilestone[] = [
  { id: 'm1', title: 'Tahap 1: Riset Kebutuhan & Wireframe UI/UX', percentageWeight: 20, isCompleted: false },
  { id: 'm2', title: 'Tahap 2: Pembuatan Desain Komponen & Interaksi', percentageWeight: 25, isCompleted: false },
  { id: 'm3', title: 'Tahap 3: Koding Logika, Data Store & Algoritma', percentageWeight: 30, isCompleted: false },
  { id: 'm4', title: 'Tahap 4: Pengujian QA, Edge Cases & Beta Test VIP', percentageWeight: 15, isCompleted: false },
  { id: 'm5', title: 'Tahap 5: Rilis Publik Resmi & Update Aplikasi PWA', percentageWeight: 10, isCompleted: false },
];

export function calculateMilestoneProgress(milestones: RoadmapMilestone[]): {
  progressPercent: number;
  status: FeatureStatus;
  statusLabel: string;
  badgeColor: string;
} {
  if (!milestones || milestones.length === 0) {
    return {
      progressPercent: 0,
      status: 'rencana',
      statusLabel: 'Rencana Pembaruan',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/90 dark:text-purple-300 border-purple-300 dark:border-purple-700'
    };
  }

  const completed = milestones.filter(m => m.isCompleted);
  const totalWeight = milestones.reduce((acc, m) => acc + m.percentageWeight, 0) || 100;
  const completedWeight = completed.reduce((acc, m) => acc + m.percentageWeight, 0);
  const progressPercent = Math.min(100, Math.round((completedWeight / totalWeight) * 100));

  if (progressPercent >= 100) {
    return {
      progressPercent: 100,
      status: 'segera_rilis',
      statusLabel: '100% Selesai • Siap Rilis',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
    };
  } else if (progressPercent >= 75) {
    return {
      progressPercent,
      status: 'segera_rilis',
      statusLabel: 'Segera Rilis • v1.4',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
    };
  } else if (progressPercent >= 35) {
    return {
      progressPercent,
      status: 'dalam_pengerjaan',
      statusLabel: 'Sedang Dikembangkan',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/90 dark:text-amber-300 border-amber-300 dark:border-amber-700'
    };
  } else if (progressPercent >= 15) {
    return {
      progressPercent,
      status: 'tahap_riset',
      statusLabel: 'Tahap Desain & Fiqih',
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950/90 dark:text-sky-300 border-sky-300 dark:border-sky-700'
    };
  } else {
    return {
      progressPercent,
      status: 'rencana',
      statusLabel: 'Rencana Pembaruan',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/90 dark:text-purple-300 border-purple-300 dark:border-purple-700'
    };
  }
}

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
    iconName: 'Compass',
    milestones: [
      { id: 'm1', title: 'Tahap 1: Riset Koordinat Ka\'bah & Formula Arah Kiblat', percentageWeight: 20, isCompleted: true },
      { id: 'm2', title: 'Tahap 2: Desain Visual Piringan Kompas 3D & Needle', percentageWeight: 25, isCompleted: true },
      { id: 'm3', title: 'Tahap 3: Integrasi Sensor Gyroscope & Perhitungan GPS', percentageWeight: 25, isCompleted: true },
      { id: 'm4', title: 'Tahap 4: Audio Suara Adzan & Uji Coba Offline', percentageWeight: 15, isCompleted: true },
      { id: 'm5', title: 'Tahap 5: Rilis Publik Resmi & Update Aplikasi PWA', percentageWeight: 15, isCompleted: false }
    ]
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
    iconName: 'FileText',
    milestones: [
      { id: 'm1', title: 'Tahap 1: Riset Format Rapor Spiritual & Metrik Evaluasi', percentageWeight: 20, isCompleted: true },
      { id: 'm2', title: 'Tahap 2: Desain Visual Kartu Prestasi & Layout Dokumen', percentageWeight: 25, isCompleted: true },
      { id: 'm3', title: 'Tahap 3: Mesin Generator Grafik Statistik & Parser Data', percentageWeight: 23, isCompleted: true },
      { id: 'm4', title: 'Tahap 4: Integrasi Renderer PDF Canvas & Resolusi Cetak', percentageWeight: 17, isCompleted: false },
      { id: 'm5', title: 'Tahap 5: Rilis Publik Resmi & Update Aplikasi PWA', percentageWeight: 15, isCompleted: false }
    ]
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
    iconName: 'Calculator',
    milestones: [
      { id: 'm1', title: 'Tahap 1: Riset Fiqih Zakat 4 Mazhab & Rumus Nisab Emas', percentageWeight: 20, isCompleted: true },
      { id: 'm2', title: 'Tahap 2: Desain Antarmuka Form Kalkulator Cepat', percentageWeight: 25, isCompleted: true },
      { id: 'm3', title: 'Tahap 3: Algoritma Perhitungan Realtime Kurs Emas & Perak', percentageWeight: 25, isCompleted: false },
      { id: 'm4', title: 'Tahap 4: Integrasi Langsung ke Riwayat Sedekah Subuh', percentageWeight: 15, isCompleted: false },
      { id: 'm5', title: 'Tahap 5: Rilis Publik Resmi & Update Aplikasi PWA', percentageWeight: 15, isCompleted: false }
    ]
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
    iconName: 'Headphones',
    milestones: [
      { id: 'm1', title: 'Tahap 1: Kurasi Audio Bebas Royalti & Rekaman Alam Fajar', percentageWeight: 20, isCompleted: true },
      { id: 'm2', title: 'Tahap 2: Desain Player Audio Minimalis & Ambient Background', percentageWeight: 10, isCompleted: true },
      { id: 'm3', title: 'Tahap 3: Mesin Pemutar Audio Offline (HTML5 Audio Web API)', percentageWeight: 35, isCompleted: false },
      { id: 'm4', title: 'Tahap 4: Fitur Sleep Timer Otomatis & Sinkron Tasbih', percentageWeight: 20, isCompleted: false },
      { id: 'm5', title: 'Tahap 5: Rilis Publik Resmi & Update Aplikasi PWA', percentageWeight: 15, isCompleted: false }
    ]
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
    iconName: 'Mail',
    milestones: [
      { id: 'm1', title: 'Tahap 1: Konsep Time-Capsule & Desain Surat Digital Kuno', percentageWeight: 20, isCompleted: true },
      { id: 'm2', title: 'Tahap 2: Sistem Enkripsi Lokal Kunci Waktu Rahasia', percentageWeight: 25, isCompleted: false },
      { id: 'm3', title: 'Tahap 3: Mekanisme Countdown Pembuka Gembok Otomatis', percentageWeight: 25, isCompleted: false },
      { id: 'm4', title: 'Tahap 4: Notifikasi Pengingat Saat Waktu Buka Tiba', percentageWeight: 15, isCompleted: false },
      { id: 'm5', title: 'Tahap 5: Rilis Publik Resmi & Update Aplikasi PWA', percentageWeight: 15, isCompleted: false }
    ]
  }
];
