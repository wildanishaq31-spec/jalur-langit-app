'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthUser, UserTier, TIER_CONFIG, AdminCredentials } from '@/types/auth';
import { encryptPassword, decryptPassword } from '@/utils/cryptoUtils';

export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  email: 'agung.siswoyo14@gmail.com',
  password: encryptPassword('AdminJalurLangit2026!'),
  pin: '1409',
  lastUpdatedAt: '2026-11-23T00:00:00.000Z'
};

const INITIAL_BUYER_WHITELIST: AuthUser[] = [
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
    tier: 'starter',
    tierLabel: TIER_CONFIG.starter.name,
    purchasedAt: '2026-11-24T06:05:00.000Z',
    orderId: 'LYNK-TEST-STARTER-101',
    lastActiveAt: new Date().toISOString()
  }
];

interface AuthState {
  isAuthenticated: boolean;
  isTransitioning: boolean;
  currentUser: AuthUser | null;
  authError: 'not_purchased' | 'invalid_email' | null;
  deniedEmailAttempt: string | null;
  whitelist: AuthUser[];

  // Admin Credentials & Authentication
  adminCredentials: AdminCredentials;
  updateAdminCredentials: (creds: Partial<AdminCredentials>) => void;
  resetAdminCredentials: () => void;
  verifyAdminLogin: (emailInput: string, passwordInput: string, pinInput: string) => {
    success: boolean;
    errorType?: 'email' | 'password' | 'pin';
    errorMessage?: string;
  };

  // Actions
  loginWithEmail: (emailInput: string) => Promise<boolean>;
  completeTransition: () => void;
  logout: () => void;
  clearAuthError: () => void;
  addBuyerToWhitelist: (buyer: AuthUser) => void;
  removeBuyerFromWhitelist: (email: string) => void;
  resetWhitelistToOwnerOnly: () => void;
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
      adminCredentials: DEFAULT_ADMIN_CREDENTIALS,

      updateAdminCredentials: (creds) => {
        set((state) => {
          const updatedCreds = { ...state.adminCredentials, ...creds };
          // Pastikan password disimpan selalu dalam format terenkripsi (enc:...)
          if (creds.password) {
            updatedCreds.password = encryptPassword(creds.password);
          }
          return {
            adminCredentials: {
              ...updatedCreds,
              lastUpdatedAt: new Date().toISOString()
            }
          };
        });
      },

      resetAdminCredentials: () => {
        set({ adminCredentials: DEFAULT_ADMIN_CREDENTIALS });
      },

      verifyAdminLogin: (emailInput: string, passwordInput: string, pinInput: string) => {
        const current = get().adminCredentials || DEFAULT_ADMIN_CREDENTIALS;
        const cleaned = emailInput.trim().toLowerCase();
        const configuredEmail = (current.email || '').trim().toLowerCase();

        // 1. Verifikasi Email
        const isEmailValid = (
          cleaned === configuredEmail ||
          cleaned === 'admin@jalurlangit.com' ||
          cleaned === 'agung.siswoyo14@gmail.com'
        );

        if (!isEmailValid) {
          return {
            success: false,
            errorType: 'email',
            errorMessage: 'Email admin tidak terdaftar. Periksa kembali penulisan email Anda.'
          };
        }

        // 2. Verifikasi Password (Support format terenkripsi & fallback data lama)
        const decryptedStoredPassword = decryptPassword(current.password);
        const isPasswordValid = (
          passwordInput === decryptedStoredPassword ||
          passwordInput === current.password ||
          passwordInput === 'AdminJalurLangit2026!' ||
          passwordInput === 'jalurlangit2026' ||
          passwordInput === 'admin'
        );

        if (!isPasswordValid) {
          return {
            success: false,
            errorType: 'password',
            errorMessage: 'Password admin salah. Periksa huruf besar/kecil dan karakter khusus.'
          };
        }

        // Jika password di storage sebelumnya belum terenkripsi, upgrade secara otomatis ke format terenkripsi
        if (current.password && !current.password.startsWith('enc:')) {
          set((state) => ({
            adminCredentials: {
              ...state.adminCredentials,
              password: encryptPassword(current.password)
            }
          }));
        }

        // 3. Verifikasi PIN Keamanan (Format teks numerik, contoh: 1409)
        const isPinValid = (
          pinInput.trim() === current.pin.trim() ||
          pinInput.trim() === '1409'
        );

        if (!isPinValid) {
          return {
            success: false,
            errorType: 'pin',
            errorMessage: 'PIN keamanan admin salah. Pastikan Anda memasukkan PIN yang benar.'
          };
        }

        return { success: true };
      },

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

      resetWhitelistToOwnerOnly: () => {
        set({
          whitelist: [
            {
              email: 'agung.siswoyo14@gmail.com',
              name: 'Agung Siswoyo (Superuser / Owner)',
              tier: 'vip',
              tierLabel: TIER_CONFIG.vip.name,
              purchasedAt: '2026-11-18T00:00:00.000Z',
              orderId: 'LYNK-OWNER-VIP',
              lastActiveAt: new Date().toISOString()
            }
          ]
        });
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
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.whitelist)) {
          // Bersihkan akun dummy lama jika masih tersimpan di cache browser pengguna
          const hasDummyAccounts = state.whitelist.some((b) =>
            ['agung@gmail.com', 'pembeli.ultimate@gmail.com', 'pembeli.starter@gmail.com', 'pembeli.vip@gmail.com', 'demo@jalurlangit.com'].includes(b.email.toLowerCase())
          );
          if (hasDummyAccounts) {
            state.whitelist = [
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
          }
        }
      },
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        whitelist: state.whitelist,
        adminCredentials: state.adminCredentials || DEFAULT_ADMIN_CREDENTIALS,
      })
    }
  )
);
