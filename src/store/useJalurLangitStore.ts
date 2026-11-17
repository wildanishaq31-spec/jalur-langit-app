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
  TimeCategory
} from '@/types';
import { TASBIH_PRESETS } from '@/data/amalanData';
import { getTodayDateString, createDateString } from '@/utils/dateUtils';

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

interface JalurLangitState {
  appTheme: AppTheme;
  setAppTheme: (theme: AppTheme) => void;

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
  isAmalanCompleted: (dateStr: string, amalanId: string) => boolean;
  getDateCompletionPercentage: (dateStr: string, totalCount: number) => number;
  
  // Hajat / Manifesting
  hajatList: HajatItem[];
  todayAffirmation: string;
  setTodayAffirmation: (text: string) => void;
  addHajat: (hajat: Omit<HajatItem, 'id' | 'createdAt'>) => void;
  updateHajatStatus: (id: string, status: HajatStatus, notes?: string) => void;
  deleteHajat: (id: string) => void;

  // Vision Board
  visionBoardItems: VisionBoardItem[];
  addVisionItem: (item: Omit<VisionBoardItem, 'id' | 'isAchieved'>) => void;
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
  deleteSedekah: (id: string) => void;
  
  // Quran & Kajian
  quranCompletedJuz: number[];
  toggleJuz: (juz: number) => void;
  kajianNotes: KajianItem[];
  addKajian: (item: Omit<KajianItem, 'id'>) => void;
  deleteKajian: (id: string) => void;
  quranTadabburList: QuranTadabburItem[];
  addQuranTadabbur: (item: Omit<QuranTadabburItem, 'id' | 'createdAt'>) => void;
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
}

export const useJalurLangitStore = create<JalurLangitState>()(
  persist(
    (set, get) => ({
      appTheme: 'blush',
      setAppTheme: (theme) => set({ appTheme: theme }),

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
        dini_hari: '03:15',
        subuh: '04:45',
        dhuha: '08:30',
        petang: '16:00',
        malam: '20:00',
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
    }),
    {
      name: 'jalur-langit-calendar-storage-v3',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
