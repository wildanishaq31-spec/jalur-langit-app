// src/utils/prayerTimeService.ts
// Layanan perhitungan dan sinkronisasi Jadwal Sholat Kemenag RI berbasis GPS HP Otomatis

import { TimeCategory } from '@/types';

export interface RawPrayerTimes {
  imsak: string;
  fajr: string;      // Subuh
  sunrise: string;   // Terbit
  dhuha: string;     // Dhuha (Jam 07:00)
  dhuhr: string;     // Zuhur
  asr: string;       // Asar
  sunset: string;
  maghrib: string;   // Magrib
  isha: string;      // Isya
  tahajjud: string;  // Dini Hari / Sepertiga Malam
}

export interface UserLocationData {
  cityName: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number; // +7 (WIB), +8 (WITA), +9 (WIT)
  isGPSActive: boolean;
  lastSyncedAt: string;
  prayerTimes: RawPrayerTimes;
}

// Daftar kota besar / perwakilan di Indonesia untuk fallback dan deteksi terdekat
export const INDONESIAN_REFERENCE_CITIES = [
  { name: 'Kabupaten Situbondo, Jawa Timur', lat: -7.706, lng: 114.008, tz: 7 },
  { name: 'Surabaya, Jawa Timur', lat: -7.257, lng: 112.752, tz: 7 },
  { name: 'Banyuwangi, Jawa Timur', lat: -8.219, lng: 114.369, tz: 7 },
  { name: 'Jember, Jawa Timur', lat: -8.172, lng: 113.700, tz: 7 },
  { name: 'Malang, Jawa Timur', lat: -7.979, lng: 112.630, tz: 7 },
  { name: 'DKI Jakarta & Sekitarnya', lat: -6.208, lng: 106.845, tz: 7 },
  { name: 'Bandung, Jawa Barat', lat: -6.917, lng: 107.619, tz: 7 },
  { name: 'Semarang, Jawa Tengah', lat: -6.966, lng: 110.438, tz: 7 },
  { name: 'Yogyakarta, DIY', lat: -7.795, lng: 110.369, tz: 7 },
  { name: 'Medan, Sumatera Utara', lat: 3.595, lng: 98.672, tz: 7 },
  { name: 'Palembang, Sumatera Selatan', lat: -2.976, lng: 104.775, tz: 7 },
  { name: 'Makassar, Sulawesi Selatan', lat: -5.147, lng: 119.432, tz: 8 },
  { name: 'Denpasar, Bali', lat: -8.670, lng: 115.212, tz: 8 },
  { name: 'Mataram, Lombok (NTB)', lat: -8.583, lng: 116.116, tz: 8 },
  { name: 'Banjarmasin, Kalimantan Selatan', lat: -3.319, lng: 114.590, tz: 8 },
  { name: 'Jayapura, Papua', lat: -2.548, lng: 140.718, tz: 9 },
];

export const DEFAULT_USER_LOCATION: UserLocationData = {
  cityName: 'Kabupaten Situbondo, Jawa Timur',
  latitude: -7.706,
  longitude: 114.008,
  timezoneOffset: 7,
  isGPSActive: false,
  lastSyncedAt: new Date().toISOString(),
  prayerTimes: {
    imsak: '03:22',
    tahajjud: '02:40',
    fajr: '03:32',
    sunrise: '04:55',
    dhuha: '07:00',
    dhuhr: '11:09',
    asr: '14:32',
    sunset: '17:24',
    maghrib: '17:24',
    isha: '18:38',
  },
};

/**
 * Mencari nama kota terdekat berdasarkan koordinat GPS
 */
export function findNearestIndonesianCity(lat: number, lng: number): string {
  let closestCity = INDONESIAN_REFERENCE_CITIES[0].name;
  let minDistance = Infinity;

  for (const city of INDONESIAN_REFERENCE_CITIES) {
    const dLat = lat - city.lat;
    const dLng = lng - city.lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    if (dist < minDistance) {
      minDistance = dist;
      closestCity = city.name;
    }
  }

  // Jika jarak sangat dekat (< 0.8 derajat atau ~85 km), gunakan nama kota tersebut
  if (minDistance < 0.8) {
    return closestCity;
  }
  return `Koordinat (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`;
}

/**
 * Algoritma astronomi offline standar Kemenag RI (Fajr: 20°, Isha: 18°, Asr Shafi'i, Ihtiyat 2 menit)
 * Menjamin aplikasi tetap bisa menghitung waktu sholat secara akurat tanpa koneksi internet.
 */
export function calculateAstronomicalPrayers(
  lat: number,
  lng: number,
  tz: number,
  date: Date = new Date()
): RawPrayerTimes {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();

  // Julian date
  const a = Math.floor((14 - m) / 12);
  const yr = y + 4800 - a;
  const mo = m + 12 * a - 3;
  const jd =
    d +
    Math.floor((153 * mo + 2) / 5) +
    365 * yr +
    Math.floor(yr / 4) -
    Math.floor(yr / 100) +
    Math.floor(yr / 400) -
    32045;
  const dJul = jd - 2451545.0;

  // Mean anomaly of the sun
  const g = (357.529 + 0.98560028 * dJul) % 360;
  const q = (280.459 + 0.98564736 * dJul) % 360;
  const L =
    (q +
      1.915 * Math.sin((g * Math.PI) / 180) +
      0.02 * Math.sin((2 * g * Math.PI) / 180)) %
    360;
  const e = 23.439 - 0.00000036 * dJul;

  const dRad = Math.asin(
    Math.sin((e * Math.PI) / 180) * Math.sin((L * Math.PI) / 180)
  );
  const decl = (dRad * 180) / Math.PI;

  // Equation of time in minutes
  const RA =
    (Math.atan2(
      Math.cos((e * Math.PI) / 180) * Math.sin((L * Math.PI) / 180),
      Math.cos((L * Math.PI) / 180)
    ) *
      180) /
    Math.PI;
  const RA_adj = (RA / 15 + 24) % 24;
  const q_adj = (q / 15 + 24) % 24;
  let eqt = (q_adj - RA_adj) * 60;
  if (eqt > 20) eqt -= 24 * 60;
  if (eqt < -20) eqt += 24 * 60;

  // Solar noon
  const noon = 12 + tz - lng / 15 - eqt / 60;

  function hourAngle(alpha: number): number | null {
    const latRad = (lat * Math.PI) / 180;
    const declRad = (decl * Math.PI) / 180;
    const alphaRad = (alpha * Math.PI) / 180;
    const cosH =
      (Math.sin(alphaRad) - Math.sin(latRad) * Math.sin(declRad)) /
      (Math.cos(latRad) * Math.cos(declRad));
    if (cosH > 1 || cosH < -1) return null;
    return (Math.acos(cosH) * 180) / Math.PI / 15;
  }

  // Sudut Kemenag RI: Subuh -20°, Terbit -0.833°, Isya -18°
  const fajrH = hourAngle(-20) || 4.2;
  const sunriseH = hourAngle(-0.833 - (0.0347 * Math.sqrt(10)) / 60) || 6.0;
  const sunsetH = hourAngle(-0.833 - (0.0347 * Math.sqrt(10)) / 60) || 6.0;
  const ishaH = hourAngle(-18) || 4.5;

  // Sudut Asar (Syafi'i: bayangan = tinggi tongkat + bayangan saat zawal)
  const latRad = (lat * Math.PI) / 180;
  const declRad = (decl * Math.PI) / 180;
  const asrAltRad = Math.atan(1 / (1 + Math.tan(Math.abs(latRad - declRad))));
  const asrH = hourAngle((asrAltRad * 180) / Math.PI) || 3.5;

  const ihtiyat = 2 / 60; // Buffer pengaman standar Kemenag RI (2 menit)

  function toHM(h: number): string {
    const totalM = Math.round(h * 60);
    const hh = String((Math.floor(totalM / 60) + 24) % 24).padStart(2, '0');
    const mm = String(totalM % 60).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  const fajrTime = noon - fajrH + ihtiyat;
  const sunriseTime = noon - sunriseH;
  const dhuhrTime = noon + ihtiyat;
  const asrTime = noon + asrH + ihtiyat;
  const sunsetTime = noon + sunsetH;
  const maghribTime = noon + sunsetH + ihtiyat;
  const ishaTime = noon + ishaH + ihtiyat;

  // Tahajjud: sepertiga malam terakhir (~50-52 menit sebelum Subuh)
  const tahajjudTime = fajrTime - 52 / 60;
  const imsakTime = fajrTime - 10 / 60;

  return {
    imsak: toHM(imsakTime),
    tahajjud: toHM(tahajjudTime),
    fajr: toHM(fajrTime),
    sunrise: toHM(sunriseTime),
    dhuha: '07:00', // Sesuai permintaan user: Dhuha mulai jam 07:00
    dhuhr: toHM(dhuhrTime),
    asr: toHM(asrTime),
    sunset: toHM(sunsetTime),
    maghrib: toHM(maghribTime),
    isha: toHM(ishaTime),
  };
}

/**
 * Mengambil waktu sholat dari API Aladhan (Metode 20 Kemenag RI),
 * dengan fallback otomatis ke perhitungan astronomi offline jika perangkat sedang offline.
 */
export async function fetchKemenagPrayerTimes(
  lat: number,
  lng: number,
  tz: number,
  date: Date = new Date()
): Promise<RawPrayerTimes> {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const dateStr = `${day}-${month}-${year}`;

  const apiUrl = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=20`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data?.data?.timings) {
        const timings = data.data.timings;
        const cleanTime = (t: string) => t.slice(0, 5);

        // Tahajjud: kurangi ~52 menit dari waktu Subuh resmi
        const [fH, fM] = cleanTime(timings.Fajr).split(':').map(Number);
        let tahajjudTotalM = fH * 60 + fM - 52;
        if (tahajjudTotalM < 0) tahajjudTotalM += 24 * 60;
        const tahajjudH = String(Math.floor(tahajjudTotalM / 60)).padStart(2, '0');
        const tahajjudM = String(tahajjudTotalM % 60).padStart(2, '0');

        return {
          imsak: cleanTime(timings.Imsak || '03:22'),
          tahajjud: `${tahajjudH}:${tahajjudM}`,
          fajr: cleanTime(timings.Fajr),
          sunrise: cleanTime(timings.Sunrise),
          dhuha: '07:00', // Sesuai permintaan user: Dhuha mulai jam 07:00
          dhuhr: cleanTime(timings.Dhuhr),
          asr: cleanTime(timings.Asr),
          sunset: cleanTime(timings.Sunset),
          maghrib: cleanTime(timings.Maghrib),
          isha: cleanTime(timings.Isha),
        };
      }
    }
  } catch (err) {
    console.warn('Menggunakan fallback astronomi offline (Kemenag formula):', err);
  }

  // Fallback offline
  return calculateAstronomicalPrayers(lat, lng, tz, date);
}

/**
 * Mengubah jadwal sholat resmi menjadi 5 kategori waktu amalan Jalur Langit
 */
export function mapPrayerTimesToAmalanCategories(
  prayers: RawPrayerTimes
): Record<TimeCategory, string> {
  return {
    dini_hari: prayers.tahajjud, // ~02:40 (Tahajjud & Sahur sepertiga malam)
    subuh: prayers.fajr,         // ~03:32 (Qobliyah Subuh, Sholat Subuh & Sedekah Subuh)
    dhuha: prayers.dhuha,       // 07:00 (Sholat Dhuha pembuka rezeki)
    petang: prayers.asr,        // ~14:32 (Sholat Ashar & QS. Al-Waqi'ah)
    malam: '20:00',             // 20:00 (QS. Al-Mulk & Istighfar sebelum tidur)
  };
}

/**
 * Mendapatkan lokasi GPS langsung dari perangkat HP/Browser
 */
export async function getDeviceGeolocation(): Promise<{ lat: number; lng: number } | null> {
  if (typeof window === 'undefined' || !('geolocation' in navigator)) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn('Izin GPS tidak diberikan atau gagal:', err.message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000 * 60 * 30, // 30 menit cache GPS
      }
    );
  });
}

/**
 * Mencoba reverse geocode nama kota secara online (OpenStreetMap Nominatim)
 */
export async function reverseGeocodeCity(lat: number, lng: number): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'JalurLangitPWA/1.0' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address;
      const city = addr?.city || addr?.county || addr?.regency || addr?.state_district;
      const state = addr?.state;
      if (city && state) {
        return `${city}, ${state}`;
      } else if (city) {
        return city;
      }
    }
  } catch {
    // Abaikan jika offline / timeout
  }
  return null;
}
