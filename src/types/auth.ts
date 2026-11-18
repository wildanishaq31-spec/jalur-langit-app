export type UserTier = 'starter' | 'ultimate' | 'vip';

export interface AuthUser {
  email: string;
  name: string;
  tier: UserTier;
  tierLabel: string;
  purchasedAt: string;
  orderId: string;
  avatarUrl?: string;
}

export const TIER_CONFIG: Record<UserTier, {
  name: string;
  price: string;
  badgeColor: string;
  accessibleTabs: Array<'home' | 'amalan' | 'tasbih' | 'glowup' | 'vision' | 'hajat' | 'quran'>;
  description: string;
}> = {
  starter: {
    name: 'Paket Starter',
    price: 'Rp 49.000',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-300 border-emerald-300',
    accessibleTabs: ['home', 'amalan', 'tasbih'],
    description: 'Amalan Langit 30 Hari, Tasbih Counter Haptik & Kalender Istiqomah'
  },
  ultimate: {
    name: 'Paket Full Bundling (Best Seller)',
    price: 'Rp 89.000',
    badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950/90 dark:text-amber-300 border-amber-300',
    accessibleTabs: ['home', 'amalan', 'tasbih', 'vision', 'hajat', 'quran'],
    description: 'Semua Fitur Spiritual: Amalan, Tasbih, Vision Board, Hajat, Sedekah & Quran Journaling'
  },
  vip: {
    name: 'Paket VIP Ultimate + Lab',
    price: 'Rp 149.000',
    badgeColor: 'bg-purple-100 text-purple-900 dark:bg-purple-950/90 dark:text-purple-300 border-purple-300',
    accessibleTabs: ['home', 'amalan', 'tasbih', 'glowup', 'vision', 'hajat', 'quran'],
    description: 'Seluruh 7 Tab Lengkap + Glow Up Habits + Surat Masa Depan + Akses Gratis Update Fitur Lab'
  }
};
