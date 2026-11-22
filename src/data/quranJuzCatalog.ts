// src/data/quranJuzCatalog.ts
// Katalog 30 Juz Al-Qur'an Standar Mushaf Rasm Utsmani (Halaman 1 - 604)

export interface QuranJuzMeta {
  juz: number;
  startSurah: string;
  endSurah: string;
  startPage: number;
  endPage: number;
  pageCount: number;
  themeSummary: string;
}

export const ALL_30_JUZ: QuranJuzMeta[] = [
  { juz: 1, startSurah: "QS. Al-Fatihah 1", endSurah: "QS. Al-Baqarah 141", startPage: 1, endPage: 21, pageCount: 21, themeSummary: "Ummul Qur'an, penciptaan manusia, kisah Nabi Adam & ketaatan hamba" },
  { juz: 2, startSurah: "QS. Al-Baqarah 142", endSurah: "QS. Al-Baqarah 252", startPage: 22, endPage: 41, pageCount: 20, themeSummary: "Pemindahan kiblat, puasa Ramadhan, haji, qishash, dan perang Thalut" },
  { juz: 3, startSurah: "QS. Al-Baqarah 253", endSurah: "QS. Ali 'Imran 92", startPage: 42, endPage: 61, pageCount: 20, themeSummary: "Ayat Kursi, keteguhan tauhid Nabi Ibrahim, sedekah & keutamaan berinfaq" },
  { juz: 4, startSurah: "QS. Ali 'Imran 93", endSurah: "QS. An-Nisa' 23", startPage: 62, endPage: 81, pageCount: 20, themeSummary: "Perang Uhud, persaudaraan mukmin, perlindungan anak yatim & waris" },
  { juz: 5, startSurah: "QS. An-Nisa' 24", endSurah: "QS. An-Nisa' 147", startPage: 82, endPage: 101, pageCount: 20, themeSummary: "Hukum keluarga, keadilan muamalah, taat kepada Ulil Amri & hukum sholat" },
  { juz: 6, startSurah: "QS. An-Nisa' 148", endSurah: "QS. Al-Ma'idah 81", startPage: 102, endPage: 121, pageCount: 20, themeSummary: "Larangan perkataan buruk, makanan halal-thoyyib, wudhu, & kisah Habil-Qabil" },
  { juz: 7, startSurah: "QS. Al-Ma'idah 82", endSurah: "QS. Al-An'am 110", startPage: 122, endPage: 141, pageCount: 20, themeSummary: "Penebus sumpah, mukjizat Nabi Isa, keagungan ciptaan langit & bumi" },
  { juz: 8, startSurah: "QS. Al-An'am 111", endSurah: "QS. Al-A'raf 87", startPage: 142, endPage: 161, pageCount: 20, themeSummary: "Peringatan syirik, adab berpakaian, dialog surga-neraka & kisah para nabi" },
  { juz: 9, startSurah: "QS. Al-A'raf 88", endSurah: "QS. Al-Anfal 40", startPage: 162, endPage: 181, pageCount: 20, themeSummary: "Kisah Nabi Musa & Firaun, perjanjian Bani Israil, dan pertolongan Badar" },
  { juz: 10, startSurah: "QS. Al-Anfal 41", endSurah: "QS. At-Taubah 92", startPage: 182, endPage: 201, pageCount: 20, themeSummary: "Ghanimah perang, pembagian zakat 8 asnaf, & keteguhan perang Tabuk" },
  { juz: 11, startSurah: "QS. At-Taubah 93", endSurah: "QS. Hud 5", startPage: 202, endPage: 221, pageCount: 20, themeSummary: "Masjid Dhirar, tobat 3 shahabat, kisah Nabi Yunus & rahmat Al-Qur'an" },
  { juz: 12, startSurah: "QS. Hud 6", endSurah: "QS. Yusuf 52", startPage: 222, endPage: 241, pageCount: 20, themeSummary: "Kisah kapal Nabi Nuh, Nabi Shalih, serta babak awal kesabaran Nabi Yusuf" },
  { juz: 13, startSurah: "QS. Yusuf 53", endSurah: "QS. Ibrahim 52", startPage: 242, endPage: 261, pageCount: 20, themeSummary: "Kemenangan Nabi Yusuf, petir bertasbih (Ar-Ra'd), & doa Nabi Ibrahim" },
  { juz: 14, startSurah: "QS. Al-Hijr 1", endSurah: "QS. An-Nahl 128", startPage: 262, endPage: 281, pageCount: 20, themeSummary: "Penjagaan Al-Qur'an, anugerah lebah & madu, serta keadilan berdakwah" },
  { juz: 15, startSurah: "QS. Al-Isra' 1", endSurah: "QS. Al-Kahfi 74", startPage: 282, endPage: 301, pageCount: 20, themeSummary: "Isra' Mi'raj, memuliakan orang tua, & kisah pemuda Ashabul Kahfi" },
  { juz: 16, startSurah: "QS. Al-Kahfi 75", endSurah: "QS. Ta-Ha 135", startPage: 302, endPage: 321, pageCount: 20, themeSummary: "Musa & Khidhir, Dzulqarnain, kelahiran Nabi Isa, serta dakwah Nabi Musa" },
  { juz: 17, startSurah: "QS. Al-Anbiya' 1", endSurah: "QS. Al-Hajj 78", startPage: 322, endPage: 341, pageCount: 20, themeSummary: "Mukjizat para anbiya', panggilan ibadah haji, & pensucian jiwa berkorban" },
  { juz: 18, startSurah: "QS. Al-Mu'minun 1", endSurah: "QS. Al-Furqan 20", startPage: 342, endPage: 361, pageCount: 20, themeSummary: "Karakter orang mukmin sejati, ayat cahaya (An-Nur), & adab memandang" },
  { juz: 19, startSurah: "QS. Al-Furqan 21", endSurah: "QS. An-Naml 55", startPage: 362, endPage: 381, pageCount: 20, themeSummary: "Sifat 'Ibadurrahman, kisah para penyair mukmin, & mukjizat Nabi Sulaiman" },
  { juz: 20, startSurah: "QS. An-Naml 56", endSurah: "QS. Al-'Ankabut 45", startPage: 382, endPage: 401, pageCount: 20, themeSummary: "Ratu Balqis, kekayaan Qarun, dan perumpamaan rumah laba-laba yang rapuh" },
  { juz: 21, startSurah: "QS. Al-'Ankabut 46", endSurah: "QS. Al-Ahzab 30", startPage: 402, endPage: 421, pageCount: 20, themeSummary: "Tanda kebesaran Ar-Rum, nasehat Luqman pada anak, & sujud penghambaan" },
  { juz: 22, startSurah: "QS. Al-Ahzab 31", endSurah: "QS. Ya-Sin 27", startPage: 422, endPage: 441, pageCount: 20, themeSummary: "Perang Ahzab, shalawat atas Nabi SAW, negeri Saba', & awal jantung Al-Qur'an" },
  { juz: 23, startSurah: "QS. Ya-Sin 28", endSurah: "QS. Az-Zumar 31", startPage: 442, endPage: 461, pageCount: 20, themeSummary: "Peringatan yaumul qiyamah, pengorbanan Nabi Ismail, & keikhlasan agama" },
  { juz: 24, startSurah: "QS. Az-Zumar 32", endSurah: "QS. Fushshilat 46", startPage: 462, endPage: 481, pageCount: 20, themeSummary: "Jangan berputus asa dari rahmat Allah, mukmin keluarga Firaun, & doa malaikat" },
  { juz: 25, startSurah: "QS. Fushshilat 47", endSurah: "QS. Al-Jatsiyah 37", startPage: 482, endPage: 501, pageCount: 20, themeSummary: "Musyawarah umat, perhiasan emas dunia, peringatan asap dukhan, & hisab" },
  { juz: 26, startSurah: "QS. Al-Ahqaf 1", endSurah: "QS. Adz-Dzariyat 30", startPage: 502, endPage: 521, pageCount: 20, themeSummary: "Kemenangan Fathu Makkah, adab berbicara di kamar (Hujurat), & dekapan Qaf" },
  { juz: 27, startSurah: "QS. Adz-Dzariyat 31", endSurah: "QS. Al-Hadid 29", startPage: 522, endPage: 541, pageCount: 20, themeSummary: "Tujuan penciptaan jin & manusia, bintang An-Najm, Ar-Rahman, & Al-Waqi'ah" },
  { juz: 28, startSurah: "QS. Al-Mujadilah 1", endSurah: "QS. At-Tahrim 12", startPage: 542, endPage: 561, pageCount: 20, themeSummary: "Gugatan wanita, pengusiran Hasyr, barisan Shaff, sholat Jum'at, & keluarga" },
  { juz: 29, startSurah: "QS. Al-Mulk 1", endSurah: "QS. Al-Mursalat 50", startPage: 562, endPage: 581, pageCount: 20, themeSummary: "Penyelamat kubur (Al-Mulk), pena Al-Qalam, qiyamul lail (Muzzammil & Muddatstsir)" },
  { juz: 30, startSurah: "QS. An-Naba' 1", endSurah: "QS. An-Nas 6", startPage: 582, endPage: 604, pageCount: 23, themeSummary: "Juz 'Amma: Berita besar kiamat, dhuha, insyirah, qadar, al-ikhlas & mu'awwidzatain" }
];

export type { QuranBookmark, QuranPaceMode } from '@/types';
import type { QuranPaceMode } from '@/types';

export interface QuranPaceConfig {
  id: QuranPaceMode;
  title: string;
  targetDailyText: string;
  pagesPerDay: number;
  estimatedDays: number;
  estimatedMonths: string;
  badge: string;
  icon: string;
  description: string;
}

export const QURAN_PACE_CONFIGS: Record<QuranPaceMode, QuranPaceConfig> = {
  pemula: {
    id: 'pemula',
    title: 'Level 1: Pemula Santai',
    targetDailyText: '1 Lembar (2 Halaman) / Hari',
    pagesPerDay: 2,
    estimatedDays: 302,
    estimatedMonths: '~10 Bulan',
    badge: 'Sangat Ringan 🌿',
    icon: 'Leaf',
    description: 'Cukup 5-7 menit per hari. Sangat cocok bagi yang baru belajar membaca, mengeja, atau memiliki kesibukan padat.'
  },
  menengah: {
    id: 'menengah',
    title: 'Level 2: Menengah Konsisten',
    targetDailyText: '2 Lembar (4 Halaman) / Hari',
    pagesPerDay: 4,
    estimatedDays: 151,
    estimatedMonths: '~5 Bulan',
    badge: 'Rekomendasi 🌟',
    icon: 'Sparkles',
    description: 'Bisa dicicil 1 halaman setiap sholat fardhu atau 2 halaman ba\'da Subuh & Maghrib. Seimbang dan menyejukkan hati.'
  },
  pejuang: {
    id: 'pejuang',
    title: 'Level 3: Pejuang 1 Day 1 Juz',
    targetDailyText: '1 Juz (20 Halaman) / Hari',
    pagesPerDay: 20,
    estimatedDays: 30,
    estimatedMonths: '1 Bulan (30 Hari)',
    badge: 'Target Sebulan 🔥',
    icon: 'Flame',
    description: 'Mencicil 4 halaman (2 lembar) setiap selesai sholat 5 waktu. Khatam 30 juz sempurna dalam 1 bulan penuh.'
  }
};

/**
 * Mencari nomor Juz Al-Qur'an berdasarkan nomor halaman (1 - 604)
 */
export function getJuzByPage(pageNumber: number): number {
  const page = Math.max(1, Math.min(604, pageNumber));
  const found = ALL_30_JUZ.find(j => page >= j.startPage && page <= j.endPage);
  return found ? found.juz : 1;
}
