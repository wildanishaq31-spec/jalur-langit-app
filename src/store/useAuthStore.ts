'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthUser, UserTier, TIER_CONFIG } from '@/types/auth';

const INITIAL_BUYER_WHITELIST: AuthUser[] = [
  {
    email: 'agung.siswoyo14@gmail.com',
    name: 'Agung Siswoyo',
    tier: 'vip',
    tierLabel: TIER_CONFIG.vip.name,
    purchasedAt: '2026-11-18T00:00:00.000Z',
    orderId: 'LYNK-OWNER-VIP',
    lastActiveAt: new Date().toISOString()
  },
  {
    email: 'agung@gmail.com',
    name: 'Agung (Owner)',
    tier: 'vip',
    tierLabel: TIER_CONFIG.vip.name,
    purchasedAt: '2026-11-18T00:00:00.000Z',
    orderId: 'LYNK-OWNER-001',
    lastActiveAt: new Date(Date.now() - 4 * 60 * 1000).toISOString()
  },
  {
    email: 'pembeli.ultimate@gmail.com',
    name: 'Sarah Muslimah',
    tier: 'ultimate',
    tierLabel: TIER_CONFIG.ultimate.name,
    purchasedAt: '2026-11-18T10:30:00.000Z',
    orderId: 'LYNK-ORD-89012',
    lastActiveAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    email: 'pembeli.starter@gmail.com',
    name: 'Rian Pratama',
    tier: 'starter',
    tierLabel: TIER_CONFIG.starter.name,
    purchasedAt: '2026-11-18T12:15:00.000Z',
    orderId: 'LYNK-ORD-49033',
    lastActiveAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    email: 'pembeli.vip@gmail.com',
    name: 'Aisyah Humaira',
    tier: 'vip',
    tierLabel: TIER_CONFIG.vip.name,
    purchasedAt: '2026-11-18T14:45:00.000Z',
    orderId: 'LYNK-ORD-14908',
    lastActiveAt: new Date(Date.now() - 55 * 60 * 1000).toISOString()
  },
  {
    email: 'demo@jalurlangit.com',
    name: 'Pengguna Demo',
    tier: 'ultimate',
    tierLabel: TIER_CONFIG.ultimate.name,
    purchasedAt: '2026-11-18T08:00:00.000Z',
    orderId: 'LYNK-DEMO-001',
    lastActiveAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString()
  }
];

interface AuthState {
  isAuthenticated: boolean;
  isTransitioning: boolean;
  currentUser: AuthUser | null;
  authError: 'not_purchased' | 'invalid_email' | null;
  deniedEmailAttempt: string | null;
  whitelist: AuthUser[];

  // Actions
  loginWithEmail: (emailInput: string) => Promise<boolean>;
  completeTransition: () => void;
  logout: () => void;
  clearAuthError: () => void;
  addBuyerToWhitelist: (buyer: AuthUser) => void;
  removeBuyerFromWhitelist: (email: string) => void;
  updateBuyerTier: (email: string, tier: UserTier) => void;
  touchUserActivity: () => void;
  loginAsAdmin: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isTransitioning: false,
      currentUser: null,
      authError: null,
      deniedEmailAttempt: null,
      whitelist: INITIAL_BUYER_WHITELIST,

      loginWithEmail: async (emailInput: string) => {
        const cleaned = emailInput.trim().toLowerCase();
        if (!cleaned || !cleaned.includes('@')) {
          set({ authError: 'invalid_email', deniedEmailAttempt: emailInput });
          return false;
        }

        // 1. Verifikasi real-time ke Server / Cloud Database (hasil otomatis dari Webhook Lynk.id)
        try {
          const res = await fetch('/api/auth/verify-buyer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cleaned })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              const activeUser: AuthUser = {
                ...data.user,
                lastActiveAt: new Date().toISOString()
              };
              set((state) => ({
                currentUser: activeUser,
                authError: null,
                deniedEmailAttempt: null,
                isTransitioning: true,
                // Simpan juga ke cache offline browser pembeli
                whitelist: [
                  activeUser,
                  ...state.whitelist.filter((b) => b.email.toLowerCase() !== cleaned)
                ]
              }));
              return true;
            }
          }
        } catch (err) {
          console.warn('Gagal menghubungi verifikasi server online, beralih ke cache lokal:', err);
        }

        // 2. Fallback verifikasi ke cache whitelist lokal jika sedang offline
        const match = get().whitelist.find(
          (b) => b.email.toLowerCase() === cleaned
        );

        if (match) {
          const activeMatch: AuthUser = {
            ...match,
            lastActiveAt: new Date().toISOString()
          };
          set((state) => ({
            currentUser: activeMatch,
            authError: null,
            deniedEmailAttempt: null,
            isTransitioning: true,
            whitelist: state.whitelist.map((b) =>
              b.email.toLowerCase() === cleaned ? activeMatch : b
            )
          }));
          return true;
        } else {
          set({
            authError: 'not_purchased',
            deniedEmailAttempt: cleaned
          });
          return false;
        }
      },

      completeTransition: () => {
        set({
          isTransitioning: false,
          isAuthenticated: true
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          isTransitioning: false,
          currentUser: null,
          authError: null,
          deniedEmailAttempt: null
        });
      },

      clearAuthError: () => {
        set({
          authError: null,
          deniedEmailAttempt: null
        });
      },

      addBuyerToWhitelist: (buyer: AuthUser) => {
        set((state) => ({
          whitelist: [
            buyer,
            ...state.whitelist.filter((b) => b.email.toLowerCase() !== buyer.email.toLowerCase())
          ]
        }));
      },

      removeBuyerFromWhitelist: (email: string) => {
        set((state) => ({
          whitelist: state.whitelist.filter(
            (b) => b.email.toLowerCase() !== email.toLowerCase()
          )
        }));
      },

      updateBuyerTier: (email: string, tier: UserTier) => {
        set((state) => ({
          whitelist: state.whitelist.map((b) => {
            if (b.email.toLowerCase() === email.toLowerCase()) {
              return {
                ...b,
                tier,
                tierLabel: TIER_CONFIG[tier].name
              };
            }
            return b;
          })
        }));
      },

      touchUserActivity: () => {
        const current = get().currentUser;
        if (!current) return;
        const now = new Date().toISOString();
        const updated = { ...current, lastActiveAt: now };
        set((state) => ({
          currentUser: updated,
          whitelist: state.whitelist.map((b) =>
            b.email.toLowerCase() === current.email.toLowerCase() ? updated : b
          )
        }));
      },

      loginAsAdmin: () => {
        const adminUser: AuthUser = {
          email: 'agung.siswoyo14@gmail.com',
          name: 'Agung Siswoyo (Owner)',
          tier: 'vip',
          tierLabel: TIER_CONFIG.vip.name,
          purchasedAt: new Date().toISOString(),
          orderId: 'LYNK-OWNER-VIP',
          lastActiveAt: new Date().toISOString()
        };
        set({
          currentUser: adminUser,
          isAuthenticated: true,
          isTransitioning: false,
          authError: null,
          deniedEmailAttempt: null
        });
      }
    }),
    {
      name: 'jalur-langit-auth-storage-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        whitelist: state.whitelist
      })
    }
  )
);
