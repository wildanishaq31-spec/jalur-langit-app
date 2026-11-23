export type TimeCategory = 'dini_hari' | 'subuh' | 'dhuha' | 'petang' | 'malam';

export type ActiveTab = 'home' | 'amalan' | 'tasbih' | 'glowup' | 'vision' | 'hajat' | 'quran';

export interface AmalanLinkedMenu {
  tab: ActiveTab;
  subTab?: string;
  presetId?: string;
  actionLabel: string;
}

export interface AmalanStep {
  step: number;
  title: string;
  detail: string;
}

export interface AmalanDalil {
  source: string; // Contoh: 'HR. Bukhari no. 1120 & Muslim no. 758' atau 'QS. Al-Isra: 79'
  grade?: 'Shahih' | 'Hasan' | "Al-Qur'an" | 'Hasan Shahih' | 'Fadhail Amal' | string;
  arabicText?: string;
  indonesianText: string;
  notes?: string;
}

export interface AmalanBacaan {
  title: string;
  arabic: string;
  latin: string;
  translation: string;
}

export interface AmalanItem {
  id: string;
  title: string;
  arabicTitle?: string;
  category: TimeCategory;
  timeRange?: string;
  description: string;
  targetCount?: number;
  targetUnit?: string;
  virtue?: string;
  isPriority?: boolean;
  linkedMenu?: AmalanLinkedMenu;

  // v3.0 Enriched Islamic Guidance Fields
  hukum?: string; // e.g. "Sunnah Mu'akkadah", "Fardhu 'Ain", "Sunnah"
  tataCara?: AmalanStep[]; // Panduan langkah demi langkah praktis
  bacaanList?: AmalanBacaan[]; // Teks Arab berharakat, latin, arti
  dalil?: AmalanDalil; // Referensi hadis/qur'an shahih/hasan
  tipsIstiqomah?: string; // Tips menjaga keistiqomahan
}

export type HajatCategory = 
  | 'rezeki' 
  | 'karir' 
  | 'jodoh' 
  | 'keluarga' 
  | 'kesehatan' 
  | 'spiritual' 
  | 'lainnya';

export type HajatStatus = 'berikhtiar' | 'menunggu' | 'terkabul' | 'hikmah';

export interface HajatItem {
  id: string;
  title: string;
  category: HajatCategory;
  specificDua: string;
  targetDate?: string;
  status: HajatStatus;
  createdAt: string;
  answeredAt?: string;
  notes?: string;
}

export interface SedekahItem {
  id: string;
  date: string;
  amount?: number;
  recipientOrPlace: string;
  prayerWish: string;
}

export interface KajianItem {
  id: string;
  date: string;
  title: string;
  speaker: string;
  videoUrl?: string;
  notes: string;
  actionPlan: string;
}

export interface TasbihPreset {
  id: string;
  name: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  target: number;
  category?: 'sholat' | 'istighfar' | 'sholawat' | 'hajat';
}

export interface DailyTasbihProgress {
  totalCount: number;
  completedPresetIds: string[];
}

// --- SELF-IMPROVEMENT & HABITS TRACKER TYPES ---

export interface VisionBoardItem {
  id: string;
  title: string;
  category: 'karir' | 'finansial' | 'spiritual' | 'kesehatan' | 'lifestyle' | 'impian';
  imageUrl: string;
  description: string;
  targetDate?: string;
  isAchieved: boolean;
}

export interface FutureLetter {
  id: string;
  title: string;
  content: string;
  writeDate: string;
  openDate: string;
  isOpened: boolean;
}

export interface GlowUpHabits {
  waterGlasses: number; // 0..8 (2 Liters)
  morningSkincare: boolean;
  nightSkincare: boolean;
  workout30Min: boolean;
  reading15Min: boolean;
  sleep7Hours: boolean;
  healthyFood: boolean;
  mood: 'happy' | 'peaceful' | 'grateful' | 'tired' | 'stressed' | 'hopeful';
  brainDump: string;
}

export interface QuranTadabburItem {
  id: string;
  surahName: string;
  ayahRange: string;
  arabicText?: string; // Teks Arab berharakat
  latinText?: string; // Transliterasi Latin
  translationText?: string; // Arti / Terjemahan Bahasa Indonesia
  youtubeLink?: string;
  story: string; // Kisah pada ayat
  topic: string; // Topik mengenai ayat ini
  wisdom: string; // Hikmah yang didapat
  actionPlan: string; // Rencana muhasabah dan penerapan pada kehidupan sehari-hari
  createdAt: string;
}

export type AppTheme = 'light' | 'dark';

export type FeatureStatus = 'segera_rilis' | 'dalam_pengerjaan' | 'tahap_riset' | 'rencana';

export interface RoadmapMilestone {
  id: string;
  title: string;
  percentageWeight: number; // Persentase bobot tahap ini (cth: 20, 25, 30, 15, 10)
  isCompleted: boolean;
  completedAt?: string;
}

export interface RoadmapFeatureItem {
  id: string;
  title: string;
  category: 'ibadah' | 'produktivitas' | 'audio' | 'finansial' | 'doa';
  status: FeatureStatus;
  statusLabel: string;
  badgeColor: string;
  progressPercent: number;
  description: string;
  highlights: string[];
  estimatedRelease: string;
  iconName: 'Compass' | 'FileText' | 'Calculator' | 'Headphones' | 'Mail' | 'Sparkles';
  votes?: number;
  createdAt?: string;
  milestones?: RoadmapMilestone[];
  isDraft?: boolean; // True jika dalam mode draf (disembunyikan dari dashboard & publik)
}

export interface FeatureUserRequest {
  id: string;
  text: string;
  submittedAt: string;
}

// --- DATA BACKUP & RESTORE CONTRACT ---

export interface JalurLangitBackupMeta {
  appName: string;
  schemaVersion: number;
  exportedAt: string;
  totalAmalanDates: number;
  totalHajat: number;
  totalSedekah: number;
  totalTasbihCount: number;
  totalGlowUpDates: number;
}

export interface QuranBookmark {
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
  pageNumber: number;
  juzNumber: number;
  updatedAt: string;
}

export type QuranPaceMode = 'pemula' | 'menengah' | 'pejuang';

export interface JalurLangitBackupData {
  app: string;
  schemaVersion: number;
  exportedAt: string;
  meta?: JalurLangitBackupMeta;
  completedAmalan?: Record<string, string[]>;
  hajatList?: HajatItem[];
  todayAffirmation?: string;
  sedekahLogs?: SedekahItem[];
  dailyTasbihMap?: Record<string, DailyTasbihProgress>;
  tasbihTotalLifetime?: number;
  glowUpMap?: Record<string, GlowUpHabits>;
  visionBoardItems?: VisionBoardItem[];
  quranCompletedJuz?: number[];
  quranBookmark?: QuranBookmark;
  quranPaceMode?: QuranPaceMode;
  dailyCicilSholatMap?: Record<string, { subuh: boolean; dzuhur: boolean; ashar: boolean; maghrib: boolean; isya: boolean }>;
  quranTadabburList?: QuranTadabburItem[];
  kajianNotes?: KajianItem[];
  gratitudeMap?: Record<string, string[]>;
  futureLetters?: FutureLetter[];
  appTheme?: AppTheme;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
}
