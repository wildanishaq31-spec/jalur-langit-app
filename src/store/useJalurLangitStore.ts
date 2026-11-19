'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  HajatItem, 
  HajatStatus, 
  SedekahItem, 
  KajianItem, 
  TasbihPreset,
  VisionBoardItem,
  FutureLetter,
  GlowUpHabits,
  QuranTadabburItem,
  AppTheme,
  DailyTasbihProgress,
  TimeCategory,
  ActiveTab,
  FeatureUserRequest
} from '@/types';
import { TASBIH_PRESETS } from '@/data/amalanData';
import { getTodayDateString, createDateString } from '@/utils/dateUtils';
import { 
  UserLocationData, 
  DEFAULT_USER_LOCATION, 
  getDeviceGeolocation, 
  reverseGeocodeCity, 
  findNearestIndonesianCity, 
  fetchKemenagPrayerTimes, 
  mapPrayerTimesToAmalanCategories 
} from '@/utils/prayerTimeService';

export const getTodayKey = getTodayDateString;

const DEFAULT_GLOW_UP: GlowUpHabits = {
  waterGlasses: 4,
  morningSkincare: false,
  nightSkincare: false,
  workout30Min: false,
  reading15Min: false,
  sleep7Hours: false,
  healthyFood: false,
  mood: 'grateful',
  brainDump: '',
};

const INITIAL_VISION_BOARD: VisionBoardItem[] = [
  {
    id: 'vb-1',
    title: 'Umrah ke Baitullah & Ziarah Madinah',
    category: 'spiritual',
    imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=80',
    description: 'Bisa sujud di depan Ka\'bah dan berdoa di Raudhah bersama keluarga tercinta.',
    targetDate: '2027-12-31',
    isAchieved: false,
  },
  {
    id: 'vb-2',
    title: 'Tabungan & Income 2 Digit Berkah',
    category: 'finansial',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80',
    description: 'Mencapai kemandirian finansial, bebas dari hutang dan riba, serta bisa memperbesar sedekah.',
    targetDate: '2027-06-30',
    isAchieved: false,
  },
  {
    id: 'vb-3',
    title: 'Kulit Sehat Glowing & Tubuh Bugar',
    category: 'kesehatan',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    description: 'Rutin minum air 2L, skincare teratur, olahraga 30 menit, dan menjaga makanan halal-thayyib.',
    isAchieved: false,
  },
  {
    id: 'vb-4',
    title: 'Karir & Karya Bermanfaat yang Berdampak',
    category: 'karir',
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
    description: 'Menjadi versi terbaik dari diri sendiri, produktif, mandiri, dan menebar kebaikan.',
    isAchieved: false,
  }
];

const INITIAL_TADABBUR: QuranTadabburItem[] = [
  {
    id: 'tadabbur-1',
    surahName: 'QS. Al-Waqi\'ah (Ayat 1-10)',
    ayahRange: 'Ayat 1-10',
    youtubeLink: 'https://youtube.com',
    story: 'Menceritakan terjadinya hari kiamat yang pasti dan pembagian manusia menjadi 3 golongan.',
    topic: 'Kepastian hari akhirat dan balasan bagi orang-orang yang beriman serta bertakwa.',
    wisdom: 'Dunia ini fana dan sementara. Rezeki yang berkah adalah bekal terbaik menuju akhirat.',
    actionPlan: 'Membaca surat ini rutin setiap petang dan menjaga kejujuran dalam mencari rezeki.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tadabbur-2',
    surahName: 'QS. At-Talaq (Ayat 2-3 - Ayat Seribu Dinar)',
    ayahRange: 'Ayat 2-3',
    story: 'Kisah janji Allah kepada orang-orang yang bertakwa saat menghadapi jalan buntu.',
    topic: 'Taqwa, tawakkal, dan jaminan jalan keluar serta rezeki dari arah tak terduga.',
    wisdom: 'Bukan kemampuan diri yang mendatangkan rezeki, melainkan rahmat dan izin Allah SWT.',
    actionPlan: 'Ketika merasa bimbang atau sempit rezeki, perbanyak istighfar dan pasrahkan kepada Allah.',
    createdAt: new Date().toISOString(),
  }
];

const INITIAL_FEATURE_VOTES: Record<string, number> = {
  kiblat_adzan: 128,
  rapor_pdf: 164,
  kalkulator_zakat: 95,
  soundscape_murottal: 142,
  future_letters: 78,
};

interface JalurLangitState {
  appTheme: AppTheme;
  setAppTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;

  // Drawer Menu & Lab Roadmap
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
  drawerActiveTab: 'lab' | 'utilitas';
  setDrawerActiveTab: (tab: 'lab' | 'utilitas') => void;
  featureVotes: Record<string, number>;
  userVotedFeatures: string[];
  voteFeature: (featureId: string) => void;
  userFeatureRequests: FeatureUserRequest[];
  addFeatureRequest: (text: string) => void;

  // Active Tab & Cross-menu Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  hajatActiveSubTab: 'hajat' | 'sedekah';
  setHajatActiveSubTab: (subTab: 'hajat' | 'sedekah') => void;
  quranActiveSubTab: 'tadabbur' | 'juz' | 'kajian' | 'syukur';
  setQuranActiveSubTab: (subTab: 'tadabbur' | 'juz' | 'kajian' | 'syukur') => void;
  lastSourceAmalanId: string | null;
  setLastSourceAmalanId: (id: string | null) => void;
  navigateToTab: (tab: ActiveTab, subTab?: string, meta?: { presetId?: string; targetCount?: number; amalanId?: string }) => void;

  // Real Calendar Navigation (Januari s/d Desember)
  calendarYear: number;
  calendarMonth: number; // 0..11
  selectedDate: string; // YYYY-MM-DD
  setCalendarYear: (year: number) => void;
  setCalendarMonth: (month: number) => void;
  prevMonth: () => void;
  nextMonth: () => void;
  setSelectedDate: (dateStr: string) => void;
  jumpToToday: () => void;

  // Completed Amalan (Key: YYYY-MM-DD)
  completedAmalan: Record<string, string[]>;
  toggleAmalan: (dateStr: string, amalanId: string) => void;
  markAmalanCompleted: (dateStr: string, amalanId: string) => void;
  markAmalanIncomplete: (dateStr: string, amalanId: string) => void;
  isAmalanCompleted: (dateStr: string, amalanId: string) => boolean;
  getDateCompletionPercentage: (dateStr: string, totalCount: number) => number;
  
  // Hajat / Manifesting
  hajatList: HajatItem[];
  todayAffirmation: string;
  setTodayAffirmation: (text: string) => void;
  addHajat: (hajat: Omit<HajatItem, 'id' | 'createdAt'>) => void;
  updateHajat: (id: string, updated: Partial<Omit<HajatItem, 'id' | 'createdAt'>>) => void;
  updateHajatStatus: (id: string, status: HajatStatus, notes?: string) => void;
  deleteHajat: (id: string) => void;

  // Vision Board
  visionBoardItems: VisionBoardItem[];
  addVisionItem: (item: Omit<VisionBoardItem, 'id' | 'isAchieved'>) => void;
  updateVisionItem: (id: string, updated: Partial<Omit<VisionBoardItem, 'id'>>) => void;
  deleteVisionItem: (id: string) => void;
  toggleVisionItemAchieved: (id: string) => void;

  // Future Letters
  futureLetters: FutureLetter[];
  addFutureLetter: (item: Omit<FutureLetter, 'id' | 'isOpened'>) => void;
  toggleOpenFutureLetter: (id: string) => void;
  deleteFutureLetter: (id: string) => void;

  // Glow Up Habits (Key: YYYY-MM-DD)
  glowUpMap: Record<string, GlowUpHabits>;
  setWaterGlasses: (dateStr: string, glasses: number) => void;
  toggleGlowUpHabit: (dateStr: string, habitKey: keyof Omit<GlowUpHabits, 'waterGlasses' | 'mood' | 'brainDump'>) => void;
  setDailyMood: (dateStr: string, mood: GlowUpHabits['mood']) => void;
  setBrainDump: (dateStr: string, text: string) => void;

  // Sedekah Subuh
  sedekahLogs: SedekahItem[];
  addSedekah: (item: Omit<SedekahItem, 'id'>) => void;
  updateSedekah: (id: string, updated: Partial<Omit<SedekahItem, 'id'>>) => void;
  deleteSedekah: (id: string) => void;
  
  // Quran & Kajian
  quranCompletedJuz: number[];
  toggleJuz: (juz: number) => void;
  kajianNotes: KajianItem[];
  addKajian: (item: Omit<KajianItem, 'id'>) => void;
  updateKajian: (id: string, updated: Partial<Omit<KajianItem, 'id'>>) => void;
  deleteKajian: (id: string) => void;
  quranTadabburList: QuranTadabburItem[];
  addQuranTadabbur: (item: Omit<QuranTadabburItem, 'id' | 'createdAt'>) => void;
  updateQuranTadabbur: (id: string, updated: Partial<Omit<QuranTadabburItem, 'id' | 'createdAt'>>) => void;
  deleteQuranTadabbur: (id: string) => void;
  
  // Gratitude (Key: YYYY-MM-DD)
  gratitudeMap: Record<string, string[]>;
  setGratitudeList: (dateStr: string, list: string[]) => void;
  
  // Tasbih
  tasbihPresetId: string;
  tasbihCount: number;
  tasbihTarget: number;
  tasbihTotalLifetime: number;
  dailyTasbihMap: Record<string, DailyTasbihProgress>;
  incrementTasbih: () => boolean;
  decrementTasbih: () => void;
  resetTasbih: () => void;
  setTasbihPreset: (presetId: string) => void;
  setCustomTarget: (target: number) => void;
  
  // Preferences & Alarm Notifications
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  notificationsEnabled: boolean;
  notificationTimes: Record<TimeCategory, string>;
  toggleSound: () => void;
  toggleVibration: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setNotificationTime: (category: TimeCategory, time: string) => void;
  resetAllData: () => void;

  // GPS Location & Prayer Times Schedule
  userLocation: UserLocationData;
  isLocationLoading: boolean;
  isAlarmModalOpen: boolean;
  setIsAlarmModalOpen: (open: boolean) => void;
  setUserLocation: (location: UserLocationData) => void;
  syncGPSPrayerTimes: () => Promise<boolean>;
  setCityManually: (cityName: string, lat: number, lng: number, tz: number) => Promise<void>;
}

export const useJalurLangitStore = create<JalurLangitState>()(
  persist(
    (set, get) => ({
      appTheme: 'light',
      setAppTheme: (theme) => set({ appTheme: theme }),
      toggleTheme: () => set((state) => ({ appTheme: state.appTheme === 'dark' ? 'light' : 'dark' })),

      // Drawer Menu & Lab Roadmap
      isDrawerOpen: false,
      setIsDrawerOpen: (open) => set({ isDrawerOpen: open }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      drawerActiveTab: 'lab',
      setDrawerActiveTab: (tab) => set({ drawerActiveTab: tab }),
      featureVotes: INITIAL_FEATURE_VOTES,
      userVotedFeatures: [],
      voteFeature: (featureId) => set((state) => {
        const isVoted = state.userVotedFeatures.includes(featureId);
        const currentCount = state.featureVotes[featureId] || 0;
        if (isVoted) {
          return {
            userVotedFeatures: state.userVotedFeatures.filter((id) => id !== featureId),
            featureVotes: {
              ...state.featureVotes,
              [featureId]: Math.max(0, currentCount - 1),
            },
          };
        } else {
          return {
            userVotedFeatures: [...state.userVotedFeatures, featureId],
            featureVotes: {
              ...state.featureVotes,
              [featureId]: currentCount + 1,
            },
          };
        }
      }),
      userFeatureRequests: [
        {
          id: 'req-1',
          text: 'Fitur reminder adzan otomatis dengan suara adzan merdu dan notifikasi GPS sesuai kota saya.',
          submittedAt: '2026-11-15T08:30:00.000Z',
        },
        {
          id: 'req-2',
          text: 'Kalkulator fidyah puasa dan zakat penghasilan bulanan langsung dalam rupiah.',
          submittedAt: '2026-11-16T14:10:00.000Z',
        }
      ],
      addFeatureRequest: (text) => set((state) => ({
        userFeatureRequests: [
          {
            id: `req-${Date.now()}`,
            text,
            submittedAt: new Date().toISOString(),
          },
          ...state.userFeatureRequests,
        ],
      })),

      // Navigation & Cross-menu integration
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),
      hajatActiveSubTab: 'hajat',
      setHajatActiveSubTab: (subTab) => set({ hajatActiveSubTab: subTab }),
      quranActiveSubTab: 'tadabbur',
      setQuranActiveSubTab: (subTab) => set({ quranActiveSubTab: subTab }),
      lastSourceAmalanId: null,
      setLastSourceAmalanId: (id) => set({ lastSourceAmalanId: id }),
      navigateToTab: (tab, subTab, meta) => {
        if (meta?.presetId) {
          get().setTasbihPreset(meta.presetId);
          if (meta.targetCount) {
            get().setCustomTarget(meta.targetCount);
          }
        }
        if (meta?.amalanId) {
          set({ lastSourceAmalanId: meta.amalanId });
        }
        if (tab === 'hajat' && (subTab === 'hajat' || subTab === 'sedekah')) {
          set({ hajatActiveSubTab: subTab });
        }
        if (tab === 'quran' && (subTab === 'tadabbur' || subTab === 'juz' || subTab === 'kajian' || subTab === 'syukur')) {
          set({ quranActiveSubTab: subTab });
        }
        set({ activeTab: tab });
      },

      calendarYear: 2026,
      calendarMonth: 10,
      selectedDate: '2026-11-17',

      setCalendarYear: (year) => set({ calendarYear: year }),
      setCalendarMonth: (month) => set({ calendarMonth: month }),

      prevMonth: () => {
        const { calendarMonth, calendarYear } = get();
        if (calendarMonth === 0) {
          set({ calendarMonth: 11, calendarYear: calendarYear - 1 });
        } else {
          set({ calendarMonth: calendarMonth - 1 });
        }
      },

      nextMonth: () => {
        const { calendarMonth, calendarYear } = get();
        if (calendarMonth === 11) {
          set({ calendarMonth: 0, calendarYear: calendarYear + 1 });
        } else {
          set({ calendarMonth: calendarMonth + 1 });
        }
      },

      setSelectedDate: (dateStr) => {
        const [y, m] = dateStr.split('-').map(Number);
        set({ 
          selectedDate: dateStr,
          calendarYear: y,
          calendarMonth: m - 1
        });
      },

      jumpToToday: () => {
        const todayStr = getTodayDateString();
        const [y, m] = todayStr.split('-').map(Number);
        set({
          selectedDate: todayStr,
          calendarYear: y,
          calendarMonth: m - 1,
        });
      },

      completedAmalan: {},

      toggleAmalan: (dateStr, amalanId) => {
        const state = get();
        const currentList = state.completedAmalan[dateStr] || [];
        const isDone = currentList.includes(amalanId);

        const updated = isDone
          ? currentList.filter((id) => id !== amalanId)
          : [...currentList, amalanId];

        set({
          completedAmalan: {
            ...state.completedAmalan,
            [dateStr]: updated,
          },
        });
      },

      markAmalanCompleted: (dateStr, amalanId) => {
        const state = get();
        const currentList = state.completedAmalan[dateStr] || [];
        if (!currentList.includes(amalanId)) {
          set({
            completedAmalan: {
              ...state.completedAmalan,
              [dateStr]: [...currentList, amalanId],
            },
          });
        }
      },

      markAmalanIncomplete: (dateStr, amalanId) => {
        const state = get();
        const currentList = state.completedAmalan[dateStr] || [];
        if (currentList.includes(amalanId)) {
          set({
            completedAmalan: {
              ...state.completedAmalan,
              [dateStr]: currentList.filter((id) => id !== amalanId),
            },
          });
        }
      },

      isAmalanCompleted: (dateStr, amalanId) => {
        const list = get().completedAmalan[dateStr] || [];
        return list.includes(amalanId);
      },

      getDateCompletionPercentage: (dateStr, totalCount) => {
        if (totalCount <= 0) return 0;
        const list = get().completedAmalan[dateStr] || [];
        return Math.min(100, Math.round((list.length / totalCount) * 100));
      },

      // Hajat
      hajatList: [
        {
          id: 'hajat-sample-1',
          title: 'Pelunasan Seluruh Amanah & Rezeki Melimpah yang Berkah',
          category: 'rezeki',
          specificDua: 'Ya Allah, cukupkanlah aku dengan rezeki yang halal dari sisi-Mu, bebaskan dari beban hutang, dan jadikan hartaku penuh keberkahan untuk bekal akhirat.',
          status: 'berikhtiar',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'hajat-sample-2',
          title: 'Mendapat Pekerjaan / Karir Terbaik yang Penuh Kebaikan',
          category: 'karir',
          specificDua: 'Ya Allah, bukakanlah pintu karir yang lapang, tempat kerja yang berkah, rekan yang sholeh, dan pendapatan yang melimpah.',
          status: 'berikhtiar',
          createdAt: new Date().toISOString(),
        }
      ],
      todayAffirmation: 'Hari ini aku bersyukur dengan tenang, percaya diri, dan menerima hal baik yang Allah hadirkan untukku.',
      setTodayAffirmation: (text) => set({ todayAffirmation: text }),
      addHajat: (item) => {
        const newItem: HajatItem = {
          ...item,
          id: `hajat-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ hajatList: [newItem, ...state.hajatList] }));
      },
      updateHajat: (id, updated) => {
        set((state) => ({
          hajatList: state.hajatList.map((h) =>
            h.id === id ? { ...h, ...updated } : h
          ),
        }));
      },
      updateHajatStatus: (id, status, notes) => {
        set((state) => ({
          hajatList: state.hajatList.map((h) =>
            h.id === id
              ? {
                  ...h,
                  status,
                  notes: notes !== undefined ? notes : h.notes,
                  answeredAt: status === 'terkabul' ? new Date().toISOString() : h.answeredAt,
                }
              : h
          ),
        }));
      },
      deleteHajat: (id) => {
        set((state) => ({ hajatList: state.hajatList.filter((h) => h.id !== id) }));
      },

      // Vision Board
      visionBoardItems: INITIAL_VISION_BOARD,
      addVisionItem: (item) => {
        const newItem: VisionBoardItem = {
          ...item,
          id: `vb-${Date.now()}`,
          isAchieved: false,
        };
        set((state) => ({ visionBoardItems: [newItem, ...state.visionBoardItems] }));
      },
      updateVisionItem: (id, updated) => {
        set((state) => ({
          visionBoardItems: state.visionBoardItems.map((v) =>
            v.id === id ? { ...v, ...updated } : v
          ),
        }));
      },
      deleteVisionItem: (id) => {
        set((state) => ({ visionBoardItems: state.visionBoardItems.filter(v => v.id !== id) }));
      },
      toggleVisionItemAchieved: (id) => {
        set((state) => ({
          visionBoardItems: state.visionBoardItems.map(v => v.id === id ? { ...v, isAchieved: !v.isAchieved } : v)
        }));
      },

      // Future Letters
      futureLetters: [
        {
          id: 'letter-1',
          title: 'Untuk Diriku Setelah 30 Hari Jalur Langit',
          content: 'Hai diriku di masa depan. Semoga ketika kamu membuka surat ini, kamu sudah menjadi pribadi yang jauh lebih dekat dengan Allah, hatimu tenang, amalanmu istiqomah, dan hajat-hajat yang kamu langitkan sudah mulai berbuah manis. Jangan pernah berhenti bersyukur!',
          writeDate: getTodayDateString(),
          openDate: 'Akhir Bulan Ini',
          isOpened: false,
        }
      ],
      addFutureLetter: (item) => {
        const newLetter: FutureLetter = {
          ...item,
          id: `letter-${Date.now()}`,
          isOpened: false,
        };
        set((state) => ({ futureLetters: [newLetter, ...state.futureLetters] }));
      },
      toggleOpenFutureLetter: (id) => {
        set((state) => ({
          futureLetters: state.futureLetters.map(l => l.id === id ? { ...l, isOpened: !l.isOpened } : l)
        }));
      },
      deleteFutureLetter: (id) => {
        set((state) => ({ futureLetters: state.futureLetters.filter(l => l.id !== id) }));
      },

      // Glow Up
      glowUpMap: {
        [getTodayDateString()]: DEFAULT_GLOW_UP,
      },
      setWaterGlasses: (dateStr, glasses) => {
        const state = get();
        const current = state.glowUpMap[dateStr] || { ...DEFAULT_GLOW_UP };
        set({
          glowUpMap: {
            ...state.glowUpMap,
            [dateStr]: { ...current, waterGlasses: Math.max(0, Math.min(8, glasses)) },
          }
        });
      },
      toggleGlowUpHabit: (dateStr, habitKey) => {
        const state = get();
        const current = state.glowUpMap[dateStr] || { ...DEFAULT_GLOW_UP };
        set({
          glowUpMap: {
            ...state.glowUpMap,
            [dateStr]: { ...current, [habitKey]: !current[habitKey] },
          }
        });
      },
      setDailyMood: (dateStr, mood) => {
        const state = get();
        const current = state.glowUpMap[dateStr] || { ...DEFAULT_GLOW_UP };
        set({
          glowUpMap: {
            ...state.glowUpMap,
            [dateStr]: { ...current, mood },
          }
        });
      },
      setBrainDump: (dateStr, text) => {
        const state = get();
        const current = state.glowUpMap[dateStr] || { ...DEFAULT_GLOW_UP };
        set({
          glowUpMap: {
            ...state.glowUpMap,
            [dateStr]: { ...current, brainDump: text },
          }
        });
      },

      // Sedekah Subuh
      sedekahLogs: [
        {
          id: 'sedekah-1',
          date: getTodayDateString(),
          amount: 20000,
          recipientOrPlace: 'Kotak Amal Subuh Rumah / QRIS Yatim',
          prayerWish: 'Semoga Allah melapangkan rezeki dan mengabulkan seluruh hajat keluarga.',
        }
      ],
      addSedekah: (item) => {
        const newItem: SedekahItem = {
          ...item,
          id: `sedekah-${Date.now()}`,
        };
        set((state) => ({ sedekahLogs: [newItem, ...state.sedekahLogs] }));
        get().markAmalanCompleted(item.date || get().selectedDate, 'sedekah_subuh');
      },
      updateSedekah: (id, updated) => {
        set((state) => ({
          sedekahLogs: state.sedekahLogs.map((s) =>
            s.id === id ? { ...s, ...updated } : s
          ),
        }));
      },
      deleteSedekah: (id) => {
        set((state) => ({ sedekahLogs: state.sedekahLogs.filter((s) => s.id !== id) }));
      },

      // Quran & Kajian
      quranCompletedJuz: [1],
      toggleJuz: (juz) => {
        set((state) => {
          const exists = state.quranCompletedJuz.includes(juz);
          return {
            quranCompletedJuz: exists
              ? state.quranCompletedJuz.filter((j) => j !== juz)
              : [...state.quranCompletedJuz, juz].sort((a, b) => a - b),
          };
        });
      },
      kajianNotes: [],
      addKajian: (item) => {
        const newItem: KajianItem = {
          ...item,
          id: `kajian-${Date.now()}`,
        };
        set((state) => ({ kajianNotes: [newItem, ...state.kajianNotes] }));
      },
      updateKajian: (id, updated) => {
        set((state) => ({
          kajianNotes: state.kajianNotes.map((k) =>
            k.id === id ? { ...k, ...updated } : k
          ),
        }));
      },
      deleteKajian: (id) => {
        set((state) => ({ kajianNotes: state.kajianNotes.filter((k) => k.id !== id) }));
      },

      quranTadabburList: INITIAL_TADABBUR,
      addQuranTadabbur: (item) => {
        const newItem: QuranTadabburItem = {
          ...item,
          id: `tadabbur-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ quranTadabburList: [newItem, ...state.quranTadabburList] }));
      },
      updateQuranTadabbur: (id, updated) => {
        set((state) => ({
          quranTadabburList: state.quranTadabburList.map((t) =>
            t.id === id ? { ...t, ...updated } : t
          ),
        }));
      },
      deleteQuranTadabbur: (id) => {
        set((state) => ({ quranTadabburList: state.quranTadabburList.filter(t => t.id !== id) }));
      },

      // Gratitude
      gratitudeMap: {
        [getTodayDateString()]: [
          'Masih diberikan nafas dan kesempatan sholat Subuh hari ini',
          'Kesehatan badan dan pikiran yang tenang',
          'Keluarga yang saling mendoakan dalam kebaikan'
        ]
      },
      setGratitudeList: (dateStr, list) => {
        set((state) => ({
          gratitudeMap: {
            ...state.gratitudeMap,
            [dateStr]: list,
          },
        }));
        if (list && list.length > 0) {
          get().markAmalanCompleted(dateStr, 'muhasabah_gratitude');
        }
      },

      // Tasbih
      tasbihPresetId: 'sholawat_jibril',
      tasbihCount: 0,
      tasbihTarget: 1000,
      tasbihTotalLifetime: 0,
      dailyTasbihMap: {},
      incrementTasbih: () => {
        const state = get();
        const dateStr = state.selectedDate;
        const newCount = state.tasbihCount + 1;
        const reachedTarget = newCount === state.tasbihTarget;

        const currentDaily = state.dailyTasbihMap[dateStr] || { totalCount: 0, completedPresetIds: [] };
        const updatedCompletedPresets = reachedTarget && !currentDaily.completedPresetIds.includes(state.tasbihPresetId)
          ? [...currentDaily.completedPresetIds, state.tasbihPresetId]
          : currentDaily.completedPresetIds;

        const updatedDaily: DailyTasbihProgress = {
          totalCount: currentDaily.totalCount + 1,
          completedPresetIds: updatedCompletedPresets,
        };

        if (state.vibrationEnabled && typeof window !== 'undefined' && 'vibrate' in navigator) {
          try {
            if (reachedTarget) {
              navigator.vibrate([80, 50, 150]);
            } else {
              navigator.vibrate(25);
            }
          } catch {
            // ignore
          }
        }

        set({
          tasbihCount: newCount,
          tasbihTotalLifetime: state.tasbihTotalLifetime + 1,
          dailyTasbihMap: {
            ...state.dailyTasbihMap,
            [dateStr]: updatedDaily,
          },
        });

        if (reachedTarget) {
          if (state.tasbihPresetId === 'sholawat_jibril') {
            get().markAmalanCompleted(dateStr, 'sholawat_jibril');
          } else if (state.tasbihPresetId === 'istighfar_sahur' || state.tasbihPresetId === 'istighfar_1000') {
            get().markAmalanCompleted(dateStr, 'istighfar_sahur');
          } else if (state.tasbihPresetId === 'dzikir_pagi') {
            get().markAmalanCompleted(dateStr, 'dzikir_pagi');
          } else if (state.tasbihPresetId === 'dzikir_petang') {
            get().markAmalanCompleted(dateStr, 'dzikir_petang');
          } else if (state.tasbihPresetId === 'sayyidul_istighfar') {
            get().markAmalanCompleted(dateStr, 'sayyidul_istighfar');
          }
        }

        return reachedTarget;
      },
      decrementTasbih: () => {
        set((state) => ({
          tasbihCount: Math.max(0, state.tasbihCount - 1),
        }));
      },
      resetTasbih: () => set({ tasbihCount: 0 }),
      setTasbihPreset: (presetId) => {
        const found = TASBIH_PRESETS.find((p) => p.id === presetId);
        if (found) {
          set({
            tasbihPresetId: presetId,
            tasbihCount: 0,
            tasbihTarget: found.target,
          });
        }
      },
      setCustomTarget: (target) => set({ tasbihTarget: Math.max(1, target) }),

      // Settings & Notifications
      soundEnabled: true,
      vibrationEnabled: true,
      notificationsEnabled: false,
      notificationTimes: {
        dini_hari: '02:40',
        subuh: '03:32',
        dhuha: '07:00',
        petang: '14:32',
        malam: '17:24',
      },
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleVibration: () => set((state) => ({ vibrationEnabled: !state.vibrationEnabled })),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setNotificationTime: (category, time) => set((state) => ({
        notificationTimes: {
          ...state.notificationTimes,
          [category]: time,
        }
      })),
      resetAllData: () => {
        set({
          selectedDate: getTodayDateString(),
          completedAmalan: {},
        });
      },

      // GPS Location & Prayer Times Schedule
      userLocation: DEFAULT_USER_LOCATION,
      isLocationLoading: false,
      isAlarmModalOpen: false,
      setIsAlarmModalOpen: (open) => set({ isAlarmModalOpen: open }),
      setUserLocation: (location) => set({ userLocation: location }),

      syncGPSPrayerTimes: async () => {
        set({ isLocationLoading: true });
        try {
          const geo = await getDeviceGeolocation();
          let lat = DEFAULT_USER_LOCATION.latitude;
          let lng = DEFAULT_USER_LOCATION.longitude;
          let isGps = false;
          let tz = 7;

          if (geo) {
            lat = geo.lat;
            lng = geo.lng;
            isGps = true;
            const offset = Math.round(-new Date().getTimezoneOffset() / 60);
            tz = offset >= 7 && offset <= 9 ? offset : 7;
          }

          let cityName = isGps ? await reverseGeocodeCity(lat, lng) : null;
          if (!cityName) {
            cityName = findNearestIndonesianCity(lat, lng);
          }

          const prayers = await fetchKemenagPrayerTimes(lat, lng, tz, new Date());
          const amalanTimes = mapPrayerTimesToAmalanCategories(prayers);

          const locationData: UserLocationData = {
            cityName,
            latitude: lat,
            longitude: lng,
            timezoneOffset: tz,
            isGPSActive: isGps,
            lastSyncedAt: new Date().toISOString(),
            prayerTimes: prayers,
          };

          set({
            userLocation: locationData,
            notificationTimes: amalanTimes,
            isLocationLoading: false,
          });

          return isGps;
        } catch (err) {
          console.error('Gagal sinkronisasi GPS:', err);
          set({ isLocationLoading: false });
          return false;
        }
      },

      setCityManually: async (cityName, lat, lng, tz) => {
        set({ isLocationLoading: true });
        try {
          const prayers = await fetchKemenagPrayerTimes(lat, lng, tz, new Date());
          const amalanTimes = mapPrayerTimesToAmalanCategories(prayers);

          set({
            userLocation: {
              cityName,
              latitude: lat,
              longitude: lng,
              timezoneOffset: tz,
              isGPSActive: false,
              lastSyncedAt: new Date().toISOString(),
              prayerTimes: prayers,
            },
            notificationTimes: amalanTimes,
            isLocationLoading: false,
          });
        } catch (err) {
          console.error('Gagal ganti kota:', err);
          set({ isLocationLoading: false });
        }
      },
    }),
    {
      name: 'jalur-langit-calendar-storage-v3',
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persistedState: any) => {
        if (persistedState && (persistedState.appTheme === 'blush' || persistedState.appTheme === 'emerald')) {
          return {
            ...persistedState,
            appTheme: 'light',
          };
        }
        return persistedState;
      },
    }
  )
);
