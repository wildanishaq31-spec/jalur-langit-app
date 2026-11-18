'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthUser, UserTier, TIER_CONFIG } from '@/types/auth';

const INITIAL_BUYER_WHITELIST: AuthUser[] = [
  {
    email: 'agung@gmail.com',
    name: 'Agung (Owner)',
    tier: 'vip',
    tierLabel: TIER_CONFIG.vip.name,
    purchasedAt: '2026-11-18T00:00:00.000Z',
    orderId: 'LYNK-OWNER-001'
  },
  {
    email: 'pembeli.ultimate@gmail.com',
    name: 'Sarah Muslimah',
    tier: 'ultimate',
    tierLabel: TIER_CONFIG.ultimate.name,
    purchasedAt: '2026-11-18T10:30:00.000Z',
    orderId: 'LYNK-ORD-89012'
  },
  {
    email: 'pembeli.starter@gmail.com',
    name: 'Rian Pratama',
    tier: 'starter',
    tierLabel: TIER_CONFIG.starter.name,
    purchasedAt: '2026-11-18T12:15:00.000Z',
    orderId: 'LYNK-ORD-49033'
  },
  {
    email: 'pembeli.vip@gmail.com',
    name: 'Aisyah Humaira',
    tier: 'vip',
    tierLabel: TIER_CONFIG.vip.name,
    purchasedAt: '2026-11-18T14:45:00.000Z',
    orderId: 'LYNK-ORD-14908'
  },
  {
    email: 'demo@jalurlangit.com',
    name: 'Pengguna Demo',
    tier: 'ultimate',
    tierLabel: TIER_CONFIG.ultimate.name,
    purchasedAt: '2026-11-18T08:00:00.000Z',
    orderId: 'LYNK-DEMO-001'
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
  loginWithEmail: (emailInput: string) => boolean;
  completeTransition: () => void;
  logout: () => void;
  clearAuthError: () => void;
  addBuyerToWhitelist: (buyer: AuthUser) => void;
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

      loginWithEmail: (emailInput: string) => {
        const cleaned = emailInput.trim().toLowerCase();
        if (!cleaned || !cleaned.includes('@')) {
          set({ authError: 'invalid_email', deniedEmailAttempt: emailInput });
          return false;
        }

        const match = get().whitelist.find(
          (b) => b.email.toLowerCase() === cleaned
        );

        if (match) {
          set({
            currentUser: match,
            authError: null,
            deniedEmailAttempt: null,
            isTransitioning: true
          });
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
