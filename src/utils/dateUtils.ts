import { TimeCategory } from '@/types';

export const MONTH_NAMES_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const DAY_NAMES_ID = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export const getTodayDateString = (): string => {
  if (typeof window === 'undefined') {
    return '2026-11-17';
  }
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getCurrentTimeString = (): string => {
  if (typeof window === 'undefined') {
    return '19:40 WIB';
  }
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m} WIB`;
};

export interface ActiveTimeSlot {
  category: TimeCategory;
  label: string;
  timeRange: string;
  icon: string;
  message: string;
}

export const getCurrentTimeCategory = (): ActiveTimeSlot => {
  if (typeof window === 'undefined') {
    return {
      category: 'malam',
      label: 'Waktu Malam',
      timeRange: '18:00 - 23:00 WIB',
      icon: '🌌',
      message: 'Waktunya Sholat Maghrib, Isya, membaca QS. Al-Mulk, Sholawat, dan Muhasabah sebelum tidur.',
    };
  }

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  // 02:30 to 04:30 = 150 to 270
  if (timeInMinutes >= 150 && timeInMinutes < 270) {
    return {
      category: 'dini_hari',
      label: 'Waktu Dini Hari',
      timeRange: '02:30 - 04:30 WIB',
      icon: '🌙',
      message: 'Waktu sepertiga malam terakhir telah tiba. Saatnya Sholat Tahajjud, Witir, & Munajat Hajat!',
    };
  }
  // 04:30 to 06:30 = 270 to 390
  if (timeInMinutes >= 270 && timeInMinutes < 390) {
    return {
      category: 'subuh',
      label: 'Waktu Subuh',
      timeRange: '04:30 - 06:30 WIB',
      icon: '🌅',
      message: 'Masuk waktu Subuh! Kerjakan Qobliyah Subuh, Sholat Subuh, & Sedekah Subuh.',
    };
  }
  // 06:30 to 15:00 = 390 to 900
  if (timeInMinutes >= 390 && timeInMinutes < 900) {
    return {
      category: 'dhuha',
      label: 'Waktu Dhuha & Siang',
      timeRange: '07:00 - 14:30 WIB',
      icon: '☀️',
      message: 'Matahari mulai meninggi, saatnya Sholat Dhuha pembuka pintu rezeki & ikhtiar bumi profesional.',
    };
  }
  // 15:00 to 18:00 = 900 to 1080
  if (timeInMinutes >= 900 && timeInMinutes < 1080) {
    return {
      category: 'petang',
      label: 'Waktu Petang',
      timeRange: '15:30 - 18:00 WIB',
      icon: '🌇',
      message: 'Waktu Ashar dan petang. Sempatkan membaca QS. Al-Waqi\'ah & Dzikir Petang.',
    };
  }
  // 18:00 to 02:30 = 1080 to 1440 or 0 to 150
  return {
    category: 'malam',
    label: 'Waktu Malam',
    timeRange: '18:00 - 23:00 WIB',
    icon: '🌌',
    message: 'Waktunya Sholat Maghrib, Isya, membaca QS. Al-Mulk pelindung kubur, & Muhasabah sebelum tidur.',
  };
};

export const formatDateIndonesian = (dateStr: string): string => {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.toLocaleDateString('id-ID', {
      timeZone: 'UTC',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const formatShortDateIndonesian = (dateStr: string): string => {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.toLocaleDateString('id-ID', {
      timeZone: 'UTC',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
};

// Monday is 0, Sunday is 6
export const getFirstDayOfMonth = (year: number, month: number): number => {
  const day = new Date(Date.UTC(year, month, 1)).getUTCDay();
  return day === 0 ? 6 : day - 1;
};

export const createDateString = (year: number, month: number, day: number): string => {
  const y = year;
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
