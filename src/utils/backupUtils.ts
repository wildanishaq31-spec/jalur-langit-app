import { JalurLangitBackupData } from '@/types';

export interface ParsedBackupPreview {
  data: Partial<JalurLangitBackupData>;
  fileName: string;
  fileSizeKb: number;
  stats: {
    amalanDays: number;
    hajatCount: number;
    sedekahCount: number;
    tasbihDays: number;
    glowUpDays: number;
  };
}

/**
 * Mengunduh data cadangan aplikasi sebagai file .json dan menyalinnya ke clipboard.
 */
export function downloadBackupJson(backupData: JalurLangitBackupData): void {
  const jsonString = JSON.stringify(backupData, null, 2);

  try {
    navigator.clipboard.writeText(jsonString);
  } catch {}

  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const datePart = new Date().toISOString().slice(0, 10);
  link.download = `jalur-langit-cadangan-${datePart}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Membaca dan memvalidasi file cadangan .json menjadi preview siap pulih.
 */
export function parseBackupFile(file: File): Promise<ParsedBackupPreview> {
  return new Promise((resolve, reject) => {
    if (!file.name.toLowerCase().endsWith('.json')) {
      reject(new Error('File harus berformat .json cadangan resmi Jalur Langit.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content) as Partial<JalurLangitBackupData>;

        if (!parsed || typeof parsed !== 'object') {
          reject(new Error('Format JSON tidak valid.'));
          return;
        }

        const amalanDays = Object.keys(parsed.completedAmalan || {}).length;
        const hajatCount = Array.isArray(parsed.hajatList) ? parsed.hajatList.length : 0;
        const sedekahCount = Array.isArray(parsed.sedekahLogs) ? parsed.sedekahLogs.length : 0;
        const tasbihDays = Object.keys(parsed.dailyTasbihMap || {}).length;
        const glowUpDays = Object.keys(parsed.glowUpMap || {}).length;

        if (amalanDays === 0 && hajatCount === 0 && sedekahCount === 0 && tasbihDays === 0 && glowUpDays === 0 && !parsed.app) {
          reject(new Error('File ini kosong atau tidak memiliki struktur data Jalur Langit.'));
          return;
        }

        resolve({
          data: parsed,
          fileName: file.name,
          fileSizeKb: Math.max(1, Math.round(file.size / 1024)),
          stats: {
            amalanDays,
            hajatCount,
            sedekahCount,
            tasbihDays,
            glowUpDays,
          },
        });
      } catch {
        reject(new Error('Gagal memproses file. Pastikan file JSON tidak korup atau rusak.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca file dari peranti Anda.'));
    };

    reader.readAsText(file);
  });
}
