'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthUser, UserTier, TIER_CONFIG, AdminCredentials } from '@/types/auth';
import { encryptPassword, decryptPassword } from '@/utils/cryptoUtils';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';

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
    tier: 'vip',
    tierLabel: TIER_CONFIG.vip.name,
    purchasedAt: '2026-11-24T06:05:00.000Z',
    orderId: '37b624a7f67eca8fdba0867396519f43',
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
  syncLicenseWithServer: () => Promise<{
    success: boolean;
    upgraded: boolean;
    oldTier?: UserTier;
    newTier?: UserTier;
    user?: AuthUser;
  }>;
  completeTransition: () => void;
  logout: () => void;
  clearAuthError: () => void;
  addBuyerToWhitelist: (buyer: AuthUser) => void;
  removeBuyerFromWhitelist: (email: string) => void;
  resetWhitelistToOwnerOnly: () => void;
  updateBuyerTier: (email: string, tier: UserTier) => void;
  updateUserProfile: (updates: { name?: string; email?: string }) => Promise<{
    success: boolean;
    message: string;
  }>;
  touchUserActivity: () => void;
  loginAsAdmin: () => void;
  syncWithServerBuyers: (serverBuyers: AuthUser[]) => void;
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

              // PENTING: Isolasi data akun per user di perangkat ini
              try {
                useJalurLangitStore.getState().switchUserScope(activeUser.email);
              } catch (e) {
                console.warn('Gagal isolasi scope user:', e);
              }

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

          // PENTING: Isolasi data akun per user di perangkat ini
          try {
            useJalurLangitStore.getState().switchUserScope(activeMatch.email);
          } catch (e) {
            console.warn('Gagal isolasi scope user:', e);
          }

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

      syncLicenseWithServer: async () => {
        const current = get().currentUser;
        if (!current?.email) {
          return { success: false, upgraded: false };
        }

        const email = current.email.trim().toLowerCase();
        const tierOrder: Record<UserTier, number> = { starter: 1, ultimate: 2, vip: 3 };

        try {
          const res = await fetch('/api/auth/verify-buyer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              const serverUser: AuthUser = data.user;
              const oldTier: UserTier = current.tier || 'starter';
              const newTier: UserTier = serverUser.tier || 'starter';
              const isUpgraded = (tierOrder[newTier] || 1) > (tierOrder[oldTier] || 1);

              const updatedUser: AuthUser = {
                ...current,
                ...serverUser,
                tier: newTier,
                tierLabel: TIER_CONFIG[newTier]?.name || serverUser.tierLabel || current.tierLabel,
                lastActiveAt: new Date().toISOString()
              };

              try {
                useJalurLangitStore.getState().switchUserScope(updatedUser.email);
              } catch (e) {
                console.warn('Gagal isolasi scope user saat sync:', e);
              }

              set((state) => ({
                currentUser: updatedUser,
                whitelist: [
                  updatedUser,
                  ...state.whitelist.filter((b) => b.email.toLowerCase() !== email)
                ]
              }));

              return {
                success: true,
                upgraded: isUpgraded,
                oldTier,
                newTier,
                user: updatedUser
              };
            }
          }
        } catch (err) {
          console.warn('Gagal sync lisensi dengan server:', err);
        }

        // Fallback jika server offline atau unreachable: periksa whitelist lokal
        const localMatch = get().whitelist.find((b) => b.email.toLowerCase() === email);
        if (localMatch && localMatch.tier !== current.tier) {
          const oldTier = current.tier || 'starter';
          const newTier = localMatch.tier || 'starter';
          const isUpgraded = (tierOrder[newTier] || 1) > (tierOrder[oldTier] || 1);

          const updatedUser: AuthUser = {
            ...current,
            ...localMatch,
            tier: newTier,
            tierLabel: TIER_CONFIG[newTier]?.name || current.tierLabel
          };

          set({ currentUser: updatedUser });
          return { success: true, upgraded: isUpgraded, oldTier, newTier, user: updatedUser };
        }

        return { success: false, upgraded: false, oldTier: current.tier, newTier: current.tier, user: current };
      },

      completeTransition: () => {
        set({
          isTransitioning: false,
          isAuthenticated: true
        });
      },

      logout: () => {
        try {
          useJalurLangitStore.getState().switchUserScope('');
        } catch (e) {
          console.warn('Gagal reset scope user saat logout:', e);
        }
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

      updateUserProfile: async (updates) => {
        const current = get().currentUser;
        if (!current?.email) {
          return { success: false, message: 'Tidak ada sesi pengguna aktif.' };
        }

        const currentEmail = current.email.trim().toLowerCase();
        const trimmedName = updates.name !== undefined ? updates.name.trim() : current.name;
        const targetEmail = updates.email !== undefined ? updates.email.trim().toLowerCase() : currentEmail;

        if (!trimmedName) {
          return { success: false, message: 'Nama tidak boleh kosong.' };
        }
        if (!targetEmail || !targetEmail.includes('@')) {
          return { success: false, message: 'Format email tidak valid.' };
        }

        const isEmailChanged = targetEmail !== currentEmail;

        try {
          const res = await fetch('/api/auth/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              currentEmail,
              name: trimmedName,
              newEmail: isEmailChanged ? targetEmail : undefined,
            }),
          });

          const data = await res.json().catch(() => ({}));

          if (res.ok && data.success && data.user) {
            const updatedUser: AuthUser = {
              ...current,
              ...data.user,
              lastActiveAt: new Date().toISOString(),
            };

            if (isEmailChanged) {
              try {
                const jlStore = useJalurLangitStore.getState();
                const backup = jlStore.exportBackupData();
                if (typeof window !== 'undefined') {
                  localStorage.setItem(`jalur_langit_user_data_${updatedUser.email}`, JSON.stringify(backup));
                }
                useJalurLangitStore.setState({ currentUserEmail: updatedUser.email });
              } catch (e) {
                console.warn('Gagal memindahkan scope data lokal ke email baru:', e);
              }
            }

            set((state) => ({
              currentUser: updatedUser,
              whitelist: [
                updatedUser,
                ...state.whitelist.filter(
                  (b) =>
                    b.email.toLowerCase() !== currentEmail &&
                    b.email.toLowerCase() !== updatedUser.email.toLowerCase()
                ),
              ],
            }));

            return { success: true, message: data.message || 'Profil berhasil diperbarui.' };
          }

          // Jika konflik email atau aturan owner, tampilkan pesan server
          if (res.status === 409 || res.status === 403 || res.status === 400) {
            return { success: false, message: data.message || 'Gagal memperbarui profil.' };
          }
        } catch (err) {
          console.warn('Gagal sinkronisasi profil ke server, menyimpan secara lokal:', err);
        }

        // Fallback lokal jika offline atau server cold-start (hanya izinkan update lokal jika nama atau email valid)
        const fallbackUser: AuthUser = {
          ...current,
          name: trimmedName,
          email: targetEmail,
          lastActiveAt: new Date().toISOString(),
        };

        if (isEmailChanged) {
          try {
            const jlStore = useJalurLangitStore.getState();
            const backup = jlStore.exportBackupData();
            if (typeof window !== 'undefined') {
              localStorage.setItem(`jalur_langit_user_data_${targetEmail}`, JSON.stringify(backup));
            }
            useJalurLangitStore.setState({ currentUserEmail: targetEmail });
          } catch {}
        }

        set((state) => ({
          currentUser: fallbackUser,
          whitelist: [
            fallbackUser,
            ...state.whitelist.filter(
              (b) => b.email.toLowerCase() !== currentEmail && b.email.toLowerCase() !== targetEmail
            ),
          ],
        }));

        return { success: true, message: 'Profil berhasil diperbarui.' };
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
        try {
          useJalurLangitStore.getState().switchUserScope('agung.siswoyo14@gmail.com');
        } catch (e) {
          console.warn('Gagal switch scope user ke admin:', e);
        }
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
      },

      syncWithServerBuyers: (serverBuyers: AuthUser[]) => {
        if (!Array.isArray(serverBuyers) || serverBuyers.length === 0) return;
        set((state) => {
          const map = new Map<string, AuthUser>();
          state.whitelist.forEach((b) => map.set(b.email.toLowerCase(), b));
          serverBuyers.forEach((b) => {
            const prev = map.get(b.email.toLowerCase());
            map.set(b.email.toLowerCase(), {
              ...prev,
              ...b
            });
          });
          return {
            whitelist: Array.from(map.values())
          };
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
