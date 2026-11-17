export type TimeCategory = 'dini_hari' | 'subuh' | 'dhuha' | 'petang' | 'malam';

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

// --- NEW TYPES BASED ON "THAT GIRL / MEGA BUNDLE" SPREADSHEET ---

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
  youtubeLink?: string;
  story: string; // Kisah pada ayat
  topic: string; // Topik mengenai ayat ini
  wisdom: string; // Hikmah yang didapat
  actionPlan: string; // Rencana muhasabah dan penerapan pada kehidupan sehari-hari
  createdAt: string;
}

export type AppTheme = 'emerald' | 'blush';
