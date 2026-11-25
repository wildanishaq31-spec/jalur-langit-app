import fs from 'fs';
import path from 'path';
import os from 'os';

export type PersistentStorageMode = 'kv' | 'supabase' | 'ephemeral';

function getRedisCredentials(): { url: string; token: string } | null {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    '';
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    '';

  if (url && token) {
    return { url: url.replace(/\/$/, ''), token };
  }
  return null;
}

function getSupabaseCredentials(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (url && key) {
    return { url: url.replace(/\/$/, ''), key };
  }
  return null;
}

export function detectStorageMode(): PersistentStorageMode {
  if (getRedisCredentials()) return 'kv';
  if (getSupabaseCredentials()) return 'supabase';
  return 'ephemeral';
}

export async function readCloudJson<T>(
  key: string,
  tempFileName: string
): Promise<{ data: T | null; mode: PersistentStorageMode; fromDiskOrCloud: boolean }> {
  const redis = getRedisCredentials();
  if (redis) {
    try {
      const res = await fetch(redis.url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${redis.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(['GET', key]),
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        if (typeof json.result === 'string' && json.result.length > 0) {
          return {
            data: JSON.parse(json.result) as T,
            mode: 'kv',
            fromDiskOrCloud: true,
          };
        }
        return { data: null, mode: 'kv', fromDiskOrCloud: false };
      }
    } catch (err) {
      console.warn(`[CloudStorage] Gagal baca Redis key ${key}:`, err);
    }
  }

  const supabase = getSupabaseCredentials();
  if (supabase) {
    try {
      const res = await fetch(
        `${supabase.url}/rest/v1/app_kv?key=eq.${encodeURIComponent(key)}&select=value`,
        {
          headers: {
            apikey: supabase.key,
            Authorization: `Bearer ${supabase.key}`,
          },
          cache: 'no-store',
        }
      );
      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0 && rows[0]?.value) {
          return {
            data: rows[0].value as T,
            mode: 'supabase',
            fromDiskOrCloud: true,
          };
        }
        return { data: null, mode: 'supabase', fromDiskOrCloud: false };
      }
    } catch (err) {
      console.warn(`[CloudStorage] Gagal baca Supabase app_kv ${key}:`, err);
    }
  }

  // Fallback ke file temporary lokal /tmp
  try {
    const tempFile = path.join(os.tmpdir(), tempFileName);
    if (fs.existsSync(tempFile)) {
      const raw = fs.readFileSync(tempFile, 'utf-8');
      if (raw) {
        return {
          data: JSON.parse(raw) as T,
          mode: detectStorageMode(),
          fromDiskOrCloud: true,
        };
      }
    }
  } catch (err) {
    console.warn(`[CloudStorage] Gagal baca temp file ${tempFileName}:`, err);
  }

  return { data: null, mode: detectStorageMode(), fromDiskOrCloud: false };
}

export async function writeCloudJson<T>(
  key: string,
  tempFileName: string,
  value: T
): Promise<{ savedToCloud: boolean; mode: PersistentStorageMode }> {
  let savedToCloud = false;
  const redis = getRedisCredentials();

  if (redis) {
    try {
      const res = await fetch(redis.url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${redis.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(['SET', key, JSON.stringify(value)]),
        cache: 'no-store',
      });
      if (res.ok) {
        savedToCloud = true;
      }
    } catch (err) {
      console.warn(`[CloudStorage] Gagal simpan Redis key ${key}:`, err);
    }
  }

  const supabase = getSupabaseCredentials();
  if (supabase && !savedToCloud) {
    try {
      const res = await fetch(`${supabase.url}/rest/v1/app_kv`, {
        method: 'POST',
        headers: {
          apikey: supabase.key,
          Authorization: `Bearer ${supabase.key}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          key,
          value,
          updated_at: new Date().toISOString(),
        }),
        cache: 'no-store',
      });
      if (res.ok) {
        savedToCloud = true;
      }
    } catch (err) {
      console.warn(`[CloudStorage] Gagal simpan Supabase app_kv ${key}:`, err);
    }
  }

  // Selalu simpan juga ke /tmp sebagai cache container lokal
  try {
    const tempFile = path.join(os.tmpdir(), tempFileName);
    fs.writeFileSync(tempFile, JSON.stringify(value, null, 2), 'utf-8');
  } catch (err) {
    console.warn(`[CloudStorage] Gagal simpan temp file ${tempFileName}:`, err);
  }

  return { savedToCloud, mode: detectStorageMode() };
}
