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

export const getCurrentTimeCategory = (customTimes?: Record<TimeCategory, string>): ActiveTimeSlot => {
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

  // Jika customTimes dari jadwal sholat GPS tersedia, gunakan batas waktu dinamis
  if (customTimes) {
    const parseHM = (timeStr?: string, defaultMin = 0) => {
      if (!timeStr) return defaultMin;
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + (m || 0);
    };

    const diniHariMin = parseHM(customTimes.dini_hari, 160); // default 02:40
    const subuhMin = parseHM(customTimes.subuh, 212);       // default 03:32
    const dhuhaMin = parseHM(customTimes.dhuha, 420);       // default 07:00
    const petangMin = parseHM(customTimes.petang, 872);     // default 14:32
    const malamMin = parseHM(customTimes.malam, 1044);      // default 17:24 (Maghrib)

    if (timeInMinutes >= diniHariMin && timeInMinutes < subuhMin) {
      return {
        category: 'dini_hari',
        label: 'Waktu Dini Hari',
        timeRange: `${customTimes.dini_hari} - ${customTimes.subuh}`,
        icon: '🌙',
        message: 'Waktu sepertiga malam terakhir telah tiba. Saatnya Sholat Tahajjud, Witir, & Munajat Hajat!',
      };
    }

    if (timeInMinutes >= subuhMin && timeInMinutes < dhuhaMin) {
      return {
        category: 'subuh',
        label: 'Waktu Subuh',
        timeRange: `${customTimes.subuh} - ${customTimes.dhuha}`,
        icon: '🌅',
        message: 'Masuk waktu Subuh! Kerjakan Qobliyah Subuh, Sholat Subuh, & Sedekah Subuh.',
      };
    }

    if (timeInMinutes >= dhuhaMin && timeInMinutes < petangMin) {
      return {
        category: 'dhuha',
        label: 'Waktu Dhuha & Siang',
        timeRange: `${customTimes.dhuha} - ${customTimes.petang}`,
        icon: '☀️',
        message: 'Matahari mulai meninggi, saatnya Sholat Dhuha pembuka pintu rezeki & ikhtiar bumi profesional.',
      };
    }

    if (timeInMinutes >= petangMin && timeInMinutes < malamMin) {
      return {
        category: 'petang',
        label: 'Waktu Petang',
        timeRange: `${customTimes.petang} - ${customTimes.malam}`,
        icon: '🌇',
        message: 'Waktu Ashar dan petang. Sempatkan membaca QS. Al-Waqi\'ah & Dzikir Petang.',
      };
    }

    return {
      category: 'malam',
      label: 'Waktu Malam',
      timeRange: `${customTimes.malam} - ${customTimes.dini_hari}`,
      icon: '🌌',
      message: 'Waktunya Sholat Maghrib, Isya, membaca QS. Al-Mulk pelindung kubur, & Muhasabah sebelum tidur.',
    };
  }

  // Fallback standar statis jika customTimes belum dimuat
  if (timeInMinutes >= 150 && timeInMinutes < 270) {
    return {
      category: 'dini_hari',
      label: 'Waktu Dini Hari',
      timeRange: '02:30 - 04:30 WIB',
      icon: '🌙',
      message: 'Waktu sepertiga malam terakhir telah tiba. Saatnya Sholat Tahajjud, Witir, & Munajat Hajat!',
    };
  }
  if (timeInMinutes >= 270 && timeInMinutes < 390) {
    return {
      category: 'subuh',
      label: 'Waktu Subuh',
      timeRange: '04:30 - 06:30 WIB',
      icon: '🌅',
      message: 'Masuk waktu Subuh! Kerjakan Qobliyah Subuh, Sholat Subuh, & Sedekah Subuh.',
    };
  }
  if (timeInMinutes >= 390 && timeInMinutes < 900) {
    return {
      category: 'dhuha',
      label: 'Waktu Dhuha & Siang',
      timeRange: '07:00 - 14:30 WIB',
      icon: '☀️',
      message: 'Matahari mulai meninggi, saatnya Sholat Dhuha pembuka pintu rezeki & ikhtiar bumi profesional.',
    };
  }
  if (timeInMinutes >= 900 && timeInMinutes < 1080) {
    return {
      category: 'petang',
      label: 'Waktu Petang',
      timeRange: '15:30 - 18:00 WIB',
      icon: '🌇',
      message: 'Waktu Ashar dan petang. Sempatkan membaca QS. Al-Waqi\'ah & Dzikir Petang.',
    };
  }
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
