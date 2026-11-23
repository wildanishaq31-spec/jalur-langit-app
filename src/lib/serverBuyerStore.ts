import { AuthUser, UserTier, TIER_CONFIG } from '@/types/auth';

// Initial default buyers (Hanya Owner sebagai Superuser)
const DEFAULT_BUYERS: AuthUser[] = [
  {
    email: 'agung.siswoyo14@gmail.com',
    name: 'Agung Siswoyo (Superuser / Owner)',
    tier: 'vip',
    tierLabel: TIER_CONFIG.vip.name,
    purchasedAt: '2026-11-18T00:00:00.000Z',
    orderId: 'LYNK-OWNER-VIP',
    lastActiveAt: new Date().toISOString()
  }
];

// Global in-memory cache preserved across serverless function warm runs
declare global {
  var __globalBuyersList: AuthUser[] | undefined;
}

if (!globalThis.__globalBuyersList) {
  globalThis.__globalBuyersList = [...DEFAULT_BUYERS];
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
  const updatedBuyer: AuthUser = {
    ...buyer,
    email: normalizedEmail,
    tierLabel: TIER_CONFIG[buyer.tier]?.name || 'Paket Jalur Langit'
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

  // Also update in-memory global cache
  const currentList = globalThis.__globalBuyersList || [...DEFAULT_BUYERS];
  const filtered = currentList.filter((b) => b.email.toLowerCase() !== normalizedEmail);
  globalThis.__globalBuyersList = [updatedBuyer, ...filtered];

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

  if (globalThis.__globalBuyersList) {
    globalThis.__globalBuyersList = globalThis.__globalBuyersList.filter(
      (b) => b.email.toLowerCase() !== normalizedEmail
    );
  }

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
