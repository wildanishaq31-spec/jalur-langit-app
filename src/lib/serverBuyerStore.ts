import fs from 'fs';
import path from 'path';
import os from 'os';
import { AuthUser, UserTier, TIER_CONFIG } from '@/types/auth';

// File temporary lokal untuk menyimpan data pembeli antar serverless invocations
const TEMP_BUYERS_FILE = path.join(os.tmpdir(), 'jalur_langit_server_buyers_v1.json');

function loadBuyersFromDisk(): AuthUser[] | null {
  try {
    if (fs.existsSync(TEMP_BUYERS_FILE)) {
      const raw = fs.readFileSync(TEMP_BUYERS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Gagal membaca temporary buyers file:', err);
  }
  return null;
}

function saveBuyersToDisk(buyers: AuthUser[]) {
  try {
    fs.writeFileSync(TEMP_BUYERS_FILE, JSON.stringify(buyers, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Gagal menyimpan temporary buyers file:', err);
  }
}

// Initial default buyers (Owner Superuser + Akun Pembeli Terverifikasi)
const DEFAULT_BUYERS: AuthUser[] = [
  {
    email: 'agung.siswoyo14@gmail.com',
    name: 'Agung Siswoyo (Superuser / Owner)',
    tier: 'vip',
    tierLabel: TIER_CONFIG.vip.name,
    purchasedAt: '2026-11-18T00:00:00.000Z',
    orderId: 'LYNK-OWNER-VIP',
    lastActiveAt: new Date().toISOString()
  },
  {
    email: 'agung.siswoyo77@gmail.com',
    name: 'Agung Siswoyo (Tester Lynk.id)',
    tier: 'vip',
    tierLabel: TIER_CONFIG.vip.name,
    purchasedAt: '2026-11-24T06:05:00.000Z',
    orderId: '37b624a7f67eca8fdba0867396519f43',
    lastActiveAt: new Date().toISOString()
  }
];

// Global in-memory cache preserved across serverless function warm runs
declare global {
  var __globalBuyersList: AuthUser[] | undefined;
}

if (!globalThis.__globalBuyersList) {
  const diskData = loadBuyersFromDisk();
  globalThis.__globalBuyersList = diskData || [...DEFAULT_BUYERS];
}

/**
 * Get all buyers from the server store.
 */
export async function getAllBuyers(): Promise<AuthUser[]> {
  // If Supabase credentials are configured in environment variables, we can fetch from Supabase:
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/buyers?select=*`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        },
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (err) {
      console.warn('Gagal menghubungi Supabase, menggunakan server memory fallback:', err);
    }
  }

  return globalThis.__globalBuyersList || DEFAULT_BUYERS;
}

/**
 * Find a buyer by email (case-insensitive).
 */
export async function findBuyerByEmail(email: string): Promise<AuthUser | null> {
  const cleaned = email.trim().toLowerCase();
  const buyers = await getAllBuyers();
  const match = buyers.find((b) => b.email.toLowerCase() === cleaned);
  return match || null;
}

/**
 * Add or update a buyer automatically when Lynk.id webhook fires.
 */
export async function addOrUpdateBuyer(buyer: AuthUser): Promise<AuthUser> {
  const normalizedEmail = buyer.email.trim().toLowerCase();
  const currentList = globalThis.__globalBuyersList || loadBuyersFromDisk() || [...DEFAULT_BUYERS];
  const existing = currentList.find((b) => b.email.toLowerCase() === normalizedEmail);

  const updatedBuyer: AuthUser = {
    ...(existing || {}),
    ...buyer,
    email: normalizedEmail,
    tierLabel: TIER_CONFIG[buyer.tier]?.name || 'Paket Jalur Langit',
    lastActiveAt: new Date().toISOString()
  };

  // If Supabase is configured:
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/buyers`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates'
        },
        body: JSON.stringify(updatedBuyer)
      });
    } catch (err) {
      console.error('Gagal upsert buyer ke Supabase:', err);
    }
  }

  // Also update in-memory global cache and disk cache
  const filtered = currentList.filter((b) => b.email.toLowerCase() !== normalizedEmail);
  const finalList = [updatedBuyer, ...filtered];
  globalThis.__globalBuyersList = finalList;
  saveBuyersToDisk(finalList);

  return updatedBuyer;
}

/**
 * Remove a buyer.
 */
export async function removeBuyer(email: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/buyers?email=eq.${normalizedEmail}`, {
        method: 'DELETE',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        }
      });
    } catch (err) {
      console.error('Gagal menghapus buyer dari Supabase:', err);
    }
  }

  const currentList = globalThis.__globalBuyersList || loadBuyersFromDisk() || [...DEFAULT_BUYERS];
  const filtered = currentList.filter((b) => b.email.toLowerCase() !== normalizedEmail);
  globalThis.__globalBuyersList = filtered;
  saveBuyersToDisk(filtered);

  return true;
}

/**
 * Determine tier automatically from Lynk.id package price or name.
 */
export function determineTierFromLynkData(productName = '', amount = 0): UserTier {
  const lowerName = productName.toLowerCase();

  // Tier VIP (Rp 149.000)
  if (lowerName.includes('vip') || lowerName.includes('ultimate +') || amount >= 140000) {
    return 'vip';
  }

  // Tier Full Bundling / Ultimate (Rp 89.000)
  if (
    lowerName.includes('full') || 
    lowerName.includes('bundling') || 
    lowerName.includes('ultimate') || 
    lowerName.includes('lengkap') ||
    amount >= 80000
  ) {
    return 'ultimate';
  }

  // Tier Starter (Rp 49.000)
  return 'starter';
}
