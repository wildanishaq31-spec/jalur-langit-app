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
  FeatureUserRequest,
  RoadmapFeatureItem,
  JalurLangitBackupData,
  JalurLangitBackupMeta
} from '@/types';
import { TASBIH_PRESETS } from '@/data/amalanData';
import { ROADMAP_FEATURES, DEFAULT_ROADMAP_MILESTONES, calculateMilestoneProgress } from '@/data/roadmapData';
import { getTodayDateString, createDateString } from '@/utils/dateUtils';
import { QuranBookmark, QuranPaceMode } from '@/data/quranJuzCatalog';
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
    surahName: "QS. Al-Waqi'ah (Ayat 1-10)",
    ayahRange: 'Ayat 1-10',
    arabicText: 'إِذَا وَقَعَتِ الْوَاقِعَةُ ۝ لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ ۝ خَافِضَةٌ رَافِعَةٌ ۝ إِذَا رُجَّتِ الْأَرْضُ رَجًّا ۝ وَبُسَّتِ الْجِبَالُ بَسًّا ۝ فَكَانَتْ هَبَاءً مُنْبَثًّا ۝ وَكُنْتُمْ أَزْوَاجًا ثَلَاثَةً ۝ فَأَصْحَابُ الْمَيْمَنَةِ مَا أَصْحَابُ الْمَيْمَنَةِ ۝ وَأَصْحَابُ الْمَشْأَمَةِ مَا أَصْحَابُ الْمَشْأَمَةِ ۝ وَالسَّابِقُونَ السَّابِقُونَ ۝ أُولَٰئِكَ الْمُقَرَّبُونَ ۝',
    latinText: "Idzaa waqa'atil waaqi'ah. Laisa liwaq'atihaa kaadzibah. Khaafidhatur raafi'ah. Idzaa rujjatil ardhu rajjaa. Wa bussatil jibaalu bassaa. Fakaanat habaa-am mumbatstsaa. Wa kuntum azwaajan tsalaatsah. Fa ash-haabul maymanati maa ash-haabul maymanah. Wa ash-haabul masy-amati maa ash-haabul masy-amah. Was saabiquunas saabiquun. Ulaa-ikal muqarrabuun.",
    translationText: '1. Apabila terjadi hari Kiamat, 2. terjadinya tidak dapat didustakan (pasti terjadi). 3. (Kejadian itu) merendahkan (satu golongan) dan meninggikan (golongan yang lain). 4. Apabila bumi diguncangkan sedahsyat-dahsyatnya, 5. dan gunung-gunung dihancurluluhkan sehancur-hancurnya, 6. maka jadilah ia debu yang beterbangan, 7. dan kamu menjadi tiga golongan: 8. yaitu golongan kanan, alangkah mulianya golongan kanan itu; 9. dan golongan kiri, alangkah sengsaranya golongan kiri itu; 10. dan orang-orang yang paling dahulu (beriman), merekalah yang paling dahulu (masuk surga). 11. Mereka itulah orang-orang yang didekatkan (kepada Allah).',
    youtubeLink: 'https://youtube.com',
    story: 'Menceritakan terjadinya hari kiamat yang pasti dan pembagian manusia menjadi 3 golongan di hadapan Allah.',
    topic: 'Kepastian hari akhirat, tingkatan hamba beriman, dan jaminan kemuliaan bagi orang bertakwa.',
    wisdom: 'Dunia ini fana dan sementara. Rezeki yang berkah dan amal sholeh adalah bekal terbaik menuju surga kenikmatan.',
    actionPlan: 'Membaca surat ini rutin setiap petang dan menjaga kejujuran serta keikhlasan dalam berikhtiar menjemput rezeki.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tadabbur-2',
    surahName: 'QS. At-Talaq (Ayat 2-3 - Ayat Seribu Dinar)',
    ayahRange: 'Ayat 2-3',
    arabicText: 'وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهو حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ ۚ قَدْ جَعَلَ اللَّهُ لِكُلِّ شَيْءٍ قَدْرًا ۝',
    latinText: "Wa may yattaqillaaha yaj'al lahuu makhrajaa. Wa yarzuqhu min haitsu laa yahtasib, wa may yatawakkal 'alallaahi fahuwa hasbuh, innallaaha baalighu amrih, qad ja'alallaahu likulli syai-in qadraa.",
    translationText: 'Barangsiapa bertakwa kepada Allah niscaya Dia akan membukakan jalan keluar baginya, dan memberinya rezeki dari arah yang tiada disangka-sangkanya. Dan barangsiapa bertawakkal kepada Allah niscaya Allah akan mencukupkan (keperluan)nya. Sesungguhnya Allah melaksanakan urusan yang (dikehendaki)-Nya. Sesungguhnya Allah telah mengadakan ketentuan bagi tiap-tiap sesuatu. (QS. At-Talaq: 2-3)',
    story: 'Janji agung Allah kepada orang-orang yang menjaga ketaqwaan saat terjepit dalam kesempitan dan kebuntuan hidup.',
    topic: 'Kunci pembuka jalan keluar, rezeki tak terduga, dan kedahsyatan tawakkal bulat kepada Allah SWT.',
    wisdom: 'Bukan kepintaran otak kita yang menyelesaikan masalah pelik, melainkan takwa dan tawakkal yang mengundang pertolongan langit.',
    actionPlan: 'Ketika merasa khawatir atau sempit rezeki, perbanyak istighfar, perbaiki sholat tepat waktu, dan pasrahkan hasil sepenuhnya kepada Allah.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tadabbur-3',
    surahName: 'QS. Al-Mulk (Ayat 1-5 - Benteng Kubur)',
    ayahRange: 'Ayat 1-5',
    arabicText: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ۝ الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ ۝ الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِنْ تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِنْ فُطُورٍ ۝',
    latinText: "Tabaarakalladzii biyadihil mulku wa huwa 'alaa kulli syai-in qadiir. Alladzii khalaqal mawta wal hayaata liyabluwakum ayyukum ahsanu 'amalaa, wa huwal 'aziizul ghafuur. Alladzii khalaqa sab'a samaawaatin thibaaqaa, maa taraa fii khalqir rahmaani min tafaawut, farji'il bashara hal taraa min futhuur.",
    translationText: '1. Maha Suci Allah Yang di tangan-Nya-lah segala kerajaan, dan Dia Maha Kuasa atas segala sesuatu. 2. Yang menciptakan mati dan hidup, untuk menguji kamu, siapa di antara kamu yang lebih baik amalnya. Dan Dia Maha Perkasa lagi Maha Pengampun. 3. Yang telah menciptakan tujuh langit berlapis-lapis. Kamu sekali-kali tidak melihat pada ciptaan Tuhan Yang Maha Pengasih sesuatu yang tidak seimbang. Maka lihatlah berulang-ulang, adakah kamu lihat sesuatu yang cacat? (QS. Al-Mulk: 1-3)',
    story: 'Penegasan kekuasaan mutlak Allah atas seluruh kerajaan langit dan bumi, serta tujuan agung penciptaan mati dan hidup sebagai ujian kualitas amal.',
    topic: 'Keagungan ciptaan Allah, kesiapan menghadapi kematian, dan keutamaan surat penyelamat dari siksa kubur.',
    wisdom: 'Mengingat kematian bukanlah untuk membuat putus asa, melainkan menyadarkan agar setiap helaan nafas diisi dengan amal terbaik.',
    actionPlan: 'Membaca dan merenungkan surat Al-Mulk setiap malam sebelum memejamkan mata dan mengintrospeksi amal seharian.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tadabbur-4',
    surahName: 'QS. Al-Kahfi (Ayat 1-4 & 10 - Perisai Dajjal)',
    ayahRange: 'Ayat 1-4, 10',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَنْزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَلْ لَهُ عِوَجًا ۜ قَيِّمًا لِيُنْذِرَ بَأْسًا شَدِيدًا مِنْ لَدُنْهُ وَيُبَشِّرَ الْمُؤْمِنِينَ ۝ ... إِذْ أَوَى الْفِتْيَةُ إِلَى الْكَهْفِ فَقَالُوا رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا ۝',
    latinText: "Alhamdulillahilladzii anzala 'alaa 'abdihil kitaaba wa lam yaj'al lahu 'iwajaa. Qayyimal liyundzira ba'san syadiidam mil ladunhu wa yubasysyiral mu'miniin... Idz awal fityatu ilal kahfi faqaaluu rabbanaa aatinaa mil ladunka rahmataw wa hayyi' lanaa min amrinaa rasyadaa.",
    translationText: '1. Segala puji bagi Allah yang telah menurunkan Kitab (Al-Qur\'an) kepada hamba-Nya dan Dia tidak menjadikannya bengkok; 2. sebagai bimbingan yang lurus, untuk memperingatkan siksaan yang sangat pedih dari sisi-Nya dan memberi kabar gembira kepada orang-orang mukmin... 10. (Ingatlah) ketika pemuda-pemuda itu berlindung ke dalam gua lalu mereka berdoa: "Ya Tuhan kami, berikanlah rahmat kepada kami dari sisi-Mu dan sempurnakanlah petunjuk yang lurus bagi kami dalam urusan kami".',
    story: 'Perjuangan para pemuda Ashabul Kahfi yang lari mengasingkan diri ke dalam gua demi mempertahankan kemurnian tauhid dari penguasa yang tiran.',
    topic: 'Keteguhan akidah, pertolongan ajaib dari Allah bagi orang beriman, dan perisai cahaya penangkal fitnah akhir zaman.',
    wisdom: 'Bila kita menjaga agama Allah, Allah akan menjaga kehidupan kita dengan skenario pertolongan yang melampaui logika manusia.',
    actionPlan: 'Membaca surat Al-Kahfi secara istiqomah setiap hari Jum\'at dan melafadzkan doa pemuda Kahfi ketika buntu menghadapi pilihan sulit.',
    createdAt: new Date().toISOString(),
  }
];

const INITIAL_FEATURE_VOTES: Record<string, number> = {
  kiblat_adzan: 0,
  rapor_pdf: 0,
  kalkulator_zakat: 0,
  soundscape_murottal: 0,
  future_letters: 0,
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
  resetFeatureVotes: () => void;
  isFeatureVotesResetV1?: boolean;
  userFeatureRequests: FeatureUserRequest[];
  addFeatureRequest: (text: string) => void;
  deleteFeatureRequest: (id: string) => void;

  // Dynamic Roadmap & Inovasi Lab Management
  roadmapFeatures: RoadmapFeatureItem[];
  addRoadmapFeature: (feature: Omit<RoadmapFeatureItem, 'id'> & { id?: string }) => void;
  updateRoadmapFeature: (id: string, updates: Partial<RoadmapFeatureItem>) => void;
  deleteRoadmapFeature: (id: string) => void;
  resetRoadmapFeatures: () => void;
  toggleRoadmapMilestone: (featureId: string, milestoneId: string) => void;
  toggleRoadmapFeatureDraft: (id: string) => void;

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
  syncToTodayIfOutdated: () => boolean;

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
  quranBookmark: QuranBookmark;
  setQuranBookmark: (bookmark: Partial<QuranBookmark>) => void;
  quranPaceMode: QuranPaceMode;
  setQuranPaceMode: (mode: QuranPaceMode) => void;
  dailyCicilSholatMap: Record<string, { subuh: boolean; dzuhur: boolean; ashar: boolean; maghrib: boolean; isya: boolean }>;
  toggleDailyCicilSholat: (dateStr: string, sholatKey: 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya') => void;
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

  // Multi-Account Data Isolation & Fresh Start
  currentUserEmail: string | null;
  switchUserScope: (newUserEmail: string) => void;
  resetToFreshUser: () => void;

  // Cloud Roadmap Synchronization
  syncRoadmapFromServer: () => Promise<void>;
  broadcastRoadmapToServer: (customFeatures?: RoadmapFeatureItem[]) => Promise<void>;

  // Backup & Restore System (Offline-first data security)
  exportBackupData: () => JalurLangitBackupData;
  restoreBackupData: (
    backup: Partial<JalurLangitBackupData>, 
    mode?: 'merge' | 'replace'
  ) => { 
    success: boolean; 
    message: string; 
    stats?: { 
      amalanDays: number; 
      hajatCount: number; 
      sedekahCount: number; 
      tasbihDays: number;
      glowUpDays: number;
    } 
  };

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
      resetFeatureVotes: () => set({
        featureVotes: {
          kiblat_adzan: 0,
          rapor_pdf: 0,
          kalkulator_zakat: 0,
          soundscape_murottal: 0,
          future_letters: 0,
        },
        userVotedFeatures: [],
        isFeatureVotesResetV1: true,
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
      deleteFeatureRequest: (id) => set((state) => ({
        userFeatureRequests: state.userFeatureRequests.filter((r) => r.id !== id),
      })),

      // Roadmap & Inovasi Fitur Lab Store (Dengan Sistem Milestone)
      roadmapFeatures: ROADMAP_FEATURES,
      addRoadmapFeature: (feature) => set((state) => {
        const newId = feature.id || `feat-${Date.now()}`;
        const finalMilestones = feature.milestones && feature.milestones.length > 0
          ? feature.milestones
          : DEFAULT_ROADMAP_MILESTONES.map(m => ({ ...m }));
        const milestoneCalc = calculateMilestoneProgress(finalMilestones);

        const newFeature: RoadmapFeatureItem = {
          ...feature,
          id: newId,
          isDraft: !!feature.isDraft,
          milestones: finalMilestones,
          progressPercent: feature.progressPercent !== undefined ? feature.progressPercent : milestoneCalc.progressPercent,
          status: feature.status || milestoneCalc.status,
          statusLabel: feature.statusLabel || milestoneCalc.statusLabel,
          badgeColor: feature.badgeColor || milestoneCalc.badgeColor,
          createdAt: new Date().toISOString()
        };
        const res = {
          roadmapFeatures: [newFeature, ...state.roadmapFeatures],
          featureVotes: {
            ...state.featureVotes,
            [newId]: state.featureVotes[newId] || 0
          }
        };
        setTimeout(() => get().broadcastRoadmapToServer(res.roadmapFeatures), 100);
        return res;
      }),
      updateRoadmapFeature: (id, updates) => {
        set((state) => {
          const updated = state.roadmapFeatures.map((f) => {
            if (f.id !== id) return f;
            const merged = { ...f, ...updates };
            if (updates.milestones) {
              const calc = calculateMilestoneProgress(updates.milestones);
              merged.progressPercent = calc.progressPercent;
              merged.status = calc.status;
              merged.statusLabel = calc.statusLabel;
              merged.badgeColor = calc.badgeColor;
            }
            return merged;
          });
          setTimeout(() => get().broadcastRoadmapToServer(updated), 100);
          return { roadmapFeatures: updated };
        });
      },
      deleteRoadmapFeature: (id) => {
        set((state) => {
          const updated = state.roadmapFeatures.filter((f) => f.id !== id);
          setTimeout(() => get().broadcastRoadmapToServer(updated), 100);
          return { roadmapFeatures: updated };
        });
      },
      resetRoadmapFeatures: () => {
        set({ roadmapFeatures: ROADMAP_FEATURES });
        setTimeout(() => get().broadcastRoadmapToServer(ROADMAP_FEATURES), 100);
      },
      toggleRoadmapMilestone: (featureId, milestoneId) => {
        set((state) => {
          const updated = state.roadmapFeatures.map((f) => {
            if (f.id !== featureId) return f;
            const currentMilestones = f.milestones && f.milestones.length > 0
              ? f.milestones
              : DEFAULT_ROADMAP_MILESTONES.map(m => ({ ...m }));
            
            const updatedMilestones = currentMilestones.map((m) => {
              if (m.id === milestoneId) {
                const nextStatus = !m.isCompleted;
                return {
                  ...m,
                  isCompleted: nextStatus,
                  completedAt: nextStatus ? new Date().toISOString() : undefined
                };
              }
              return m;
            });

            const calc = calculateMilestoneProgress(updatedMilestones);

            return {
              ...f,
              milestones: updatedMilestones,
              progressPercent: calc.progressPercent,
              status: calc.status,
              statusLabel: calc.statusLabel,
              badgeColor: calc.badgeColor
            };
          });
          setTimeout(() => get().broadcastRoadmapToServer(updated), 100);
          return { roadmapFeatures: updated };
        });
      },
      toggleRoadmapFeatureDraft: (id) => {
        set((state) => {
          const updated = state.roadmapFeatures.map((f) => {
            if (f.id !== id) return f;
            return {
              ...f,
              isDraft: !f.isDraft
            };
          });
          setTimeout(() => get().broadcastRoadmapToServer(updated), 100);
          return { roadmapFeatures: updated };
        });
      },

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

      calendarYear: new Date().getFullYear(),
      calendarMonth: new Date().getMonth(),
      selectedDate: getTodayDateString(),

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

      syncToTodayIfOutdated: () => {
        const todayStr = getTodayDateString();
        const state = get();
        if (state.selectedDate !== todayStr) {
          const [y, m] = todayStr.split('-').map(Number);
          set({
            selectedDate: todayStr,
            calendarYear: y,
            calendarMonth: m - 1,
          });
          return true;
        }
        return false;
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
        get().markAmalanCompleted(get().selectedDate, 'hajat_dini_hari');
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
      quranBookmark: {
        surahName: 'Al-Fatihah',
        surahNumber: 1,
        ayahNumber: 1,
        pageNumber: 1,
        juzNumber: 1,
        updatedAt: getTodayDateString(),
      },
      setQuranBookmark: (bookmark) => {
        set((state) => ({
          quranBookmark: {
            ...state.quranBookmark,
            ...bookmark,
            updatedAt: getTodayDateString(),
          }
        }));
      },
      quranPaceMode: 'menengah',
      setQuranPaceMode: (mode) => {
        set({ quranPaceMode: mode });
      },
      dailyCicilSholatMap: {},
      toggleDailyCicilSholat: (dateStr, sholatKey) => {
        const state = get();
        const currentDayMap = state.dailyCicilSholatMap[dateStr] || {
          subuh: false,
          dzuhur: false,
          ashar: false,
          maghrib: false,
          isya: false,
        };
        const nextVal = !currentDayMap[sholatKey];
        const updatedDay = {
          ...currentDayMap,
          [sholatKey]: nextVal,
        };
        const allDone = updatedDay.subuh && updatedDay.dzuhur && updatedDay.ashar && updatedDay.maghrib && updatedDay.isya;

        set((s) => ({
          dailyCicilSholatMap: {
            ...s.dailyCicilSholatMap,
            [dateStr]: updatedDay,
          }
        }));

        if (allDone) {
          get().markAmalanCompleted(dateStr, 'tilawah_one_day_one_juz');
        }
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
        const state = get();
        const dateStr = state.selectedDate;
        const currentDaily = state.dailyTasbihMap[dateStr] || { totalCount: 0, completedPresetIds: [] };
        const updatedDaily: DailyTasbihProgress = {
          ...currentDaily,
          totalCount: Math.max(0, currentDaily.totalCount - 1),
        };

        set({
          tasbihCount: Math.max(0, state.tasbihCount - 1),
          tasbihTotalLifetime: Math.max(0, state.tasbihTotalLifetime - 1),
          dailyTasbihMap: {
            ...state.dailyTasbihMap,
            [dateStr]: updatedDaily,
          },
        });
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

      // Multi-Account Data Isolation & Fresh Start
      currentUserEmail: null,
      switchUserScope: (newUserEmail: string) => {
        const state = get();
        const currentEmail = (state.currentUserEmail || '').trim().toLowerCase();
        const targetEmail = (newUserEmail || '').trim().toLowerCase();

        if (!targetEmail) {
          set({ currentUserEmail: null });
          return;
        }

        if (currentEmail === targetEmail) {
          return;
        }

        // 1. Simpan snapshot data akun sebelumnya di localStorage browser perangkat ini
        if (currentEmail && typeof window !== 'undefined') {
          try {
            const backup = state.exportBackupData();
            localStorage.setItem(`jalur_langit_user_data_${currentEmail}`, JSON.stringify(backup));
          } catch (e) {
            console.warn('Gagal menyimpan cache akun lama:', e);
          }
        }

        // 2. Cek apakah user target sudah pernah punya data tersimpan di browser ini
        if (typeof window !== 'undefined') {
          const existingDataStr = localStorage.getItem(`jalur_langit_user_data_${targetEmail}`);
          if (existingDataStr) {
            try {
              const parsed = JSON.parse(existingDataStr);
              get().restoreBackupData(parsed, 'replace');
              set({ currentUserEmail: targetEmail });
              return;
            } catch (e) {
              console.warn('Gagal memuat cache user target:', e);
            }
          }
        }

        // 3. Jika belum pernah tersimpan di browser ini -> Berikan tampilan KOSONGAN (0% amalan, fresh start)
        get().resetToFreshUser();
        set({ currentUserEmail: targetEmail });
      },

      resetToFreshUser: () => {
        set({
          selectedDate: getTodayDateString(),
          completedAmalan: {},
          hajatList: [],
          todayAffirmation: 'Hari ini aku bersyukur dengan tenang, percaya diri, dan menerima hal baik yang Allah hadirkan untukku.',
          sedekahLogs: [],
          dailyTasbihMap: {},
          tasbihCount: 0,
          tasbihTotalLifetime: 0,
          glowUpMap: {
            [getTodayDateString()]: { ...DEFAULT_GLOW_UP },
          },
          visionBoardItems: [],
          quranCompletedJuz: [],
          dailyCicilSholatMap: {},
          gratitudeMap: {},
          futureLetters: [],
          kajianNotes: [],
        });
      },

      // Cloud Roadmap Synchronization
      syncRoadmapFromServer: async () => {
        try {
          const res = await fetch('/api/roadmap', { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.features) && data.features.length > 0) {
              set({ roadmapFeatures: data.features });
            }
          }
        } catch (err) {
          console.warn('Gagal mengambil roadmap dari server:', err);
        }
      },

      broadcastRoadmapToServer: async (customFeatures?: RoadmapFeatureItem[]) => {
        try {
          const features = customFeatures || get().roadmapFeatures;
          if (Array.isArray(features) && features.length > 0) {
            await fetch('/api/roadmap', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ features })
            });
          }
        } catch (err) {
          console.warn('Gagal broadcast roadmap ke server:', err);
        }
      },

      // Backup & Restore Implementation
      exportBackupData: (): JalurLangitBackupData => {
        const state = get();
        const amalanDates = Object.keys(state.completedAmalan || {}).length;
        const hajatCount = (state.hajatList || []).length;
        const sedekahCount = (state.sedekahLogs || []).length;
        const glowUpDates = Object.keys(state.glowUpMap || {}).length;

        const backup: JalurLangitBackupData = {
          app: 'Jalur Langit PWA',
          schemaVersion: 3,
          exportedAt: new Date().toISOString(),
          meta: {
            appName: 'Jalur Langit - Spiritual & Self Improvement Planner',
            schemaVersion: 3,
            exportedAt: new Date().toISOString(),
            totalAmalanDates: amalanDates,
            totalHajat: hajatCount,
            totalSedekah: sedekahCount,
            totalTasbihCount: state.tasbihTotalLifetime || 0,
            totalGlowUpDates: glowUpDates,
          },
          completedAmalan: state.completedAmalan || {},
          hajatList: state.hajatList || [],
          todayAffirmation: state.todayAffirmation || '',
          sedekahLogs: state.sedekahLogs || [],
          dailyTasbihMap: state.dailyTasbihMap || {},
          tasbihTotalLifetime: state.tasbihTotalLifetime || 0,
          glowUpMap: state.glowUpMap || {},
          visionBoardItems: state.visionBoardItems || [],
          quranCompletedJuz: state.quranCompletedJuz || [],
          quranBookmark: state.quranBookmark,
          quranPaceMode: state.quranPaceMode,
          dailyCicilSholatMap: state.dailyCicilSholatMap || {},
          quranTadabburList: state.quranTadabburList || [],
          kajianNotes: state.kajianNotes || [],
          gratitudeMap: state.gratitudeMap || {},
          futureLetters: state.futureLetters || [],
          appTheme: state.appTheme,
          soundEnabled: state.soundEnabled,
          vibrationEnabled: state.vibrationEnabled,
        };

        return backup;
      },

      restoreBackupData: (backup, mode = 'merge') => {
        if (!backup || typeof backup !== 'object') {
          return { success: false, message: 'Format data cadangan tidak dikenali.' };
        }

        const current = get();

        if (mode === 'replace') {
          // Gantikan seluruh data secara menyeluruh
          set({
            completedAmalan: backup.completedAmalan || {},
            hajatList: Array.isArray(backup.hajatList) ? backup.hajatList : [],
            todayAffirmation: backup.todayAffirmation ?? current.todayAffirmation,
            sedekahLogs: Array.isArray(backup.sedekahLogs) ? backup.sedekahLogs : [],
            dailyTasbihMap: backup.dailyTasbihMap || {},
            tasbihTotalLifetime: typeof backup.tasbihTotalLifetime === 'number' ? backup.tasbihTotalLifetime : 0,
            glowUpMap: backup.glowUpMap || {},
            visionBoardItems: Array.isArray(backup.visionBoardItems) && backup.visionBoardItems.length > 0 ? backup.visionBoardItems : current.visionBoardItems,
            quranCompletedJuz: Array.isArray(backup.quranCompletedJuz) ? backup.quranCompletedJuz : [],
            ...(backup.quranBookmark ? { quranBookmark: backup.quranBookmark } : {}),
            ...(backup.quranPaceMode ? { quranPaceMode: backup.quranPaceMode } : {}),
            dailyCicilSholatMap: backup.dailyCicilSholatMap || {},
            quranTadabburList: Array.isArray(backup.quranTadabburList) ? backup.quranTadabburList : [],
            kajianNotes: Array.isArray(backup.kajianNotes) ? backup.kajianNotes : [],
            gratitudeMap: backup.gratitudeMap || {},
            futureLetters: Array.isArray(backup.futureLetters) ? backup.futureLetters : [],
            ...(backup.appTheme ? { appTheme: backup.appTheme } : {}),
            ...(typeof backup.soundEnabled === 'boolean' ? { soundEnabled: backup.soundEnabled } : {}),
            ...(typeof backup.vibrationEnabled === 'boolean' ? { vibrationEnabled: backup.vibrationEnabled } : {}),
          });
        } else {
          // Mode 'merge' (Aman: menggabungkan data cadangan tanpa menghapus data aktif)
          // 1. Amalan Checklist
          const mergedAmalan = { ...(current.completedAmalan || {}) };
          for (const [date, list] of Object.entries(backup.completedAmalan || {})) {
            if (Array.isArray(list)) {
              mergedAmalan[date] = Array.from(new Set([...(mergedAmalan[date] || []), ...list]));
            }
          }

          // 2. Hajat List (gabungkan berdasarkan ID unik)
          const currentHajatMap = new Map((current.hajatList || []).map(item => [item.id, item]));
          for (const item of backup.hajatList || []) {
            if (item && item.id) {
              currentHajatMap.set(item.id, item);
            }
          }

          // 3. Sedekah Logs (gabungkan berdasarkan ID unik)
          const currentSedekahMap = new Map((current.sedekahLogs || []).map(item => [item.id, item]));
          for (const item of backup.sedekahLogs || []) {
            if (item && item.id) {
              currentSedekahMap.set(item.id, item);
            }
          }

          // 4. Tasbih Progress Harian
          const mergedTasbihMap = { ...(current.dailyTasbihMap || {}) };
          for (const [date, progress] of Object.entries(backup.dailyTasbihMap || {})) {
            if (progress && typeof progress === 'object') {
              const existing = mergedTasbihMap[date];
              if (existing) {
                mergedTasbihMap[date] = {
                  totalCount: Math.max(existing.totalCount || 0, progress.totalCount || 0),
                  completedPresetIds: Array.from(new Set([...(existing.completedPresetIds || []), ...(progress.completedPresetIds || [])])),
                };
              } else {
                mergedTasbihMap[date] = progress;
              }
            }
          }

          // 5. Glow Up / Habits Map
          const mergedGlowUp = { ...(current.glowUpMap || {}), ...(backup.glowUpMap || {}) };

          // 6. Vision Board Items
          const currentVisionMap = new Map((current.visionBoardItems || []).map(item => [item.id, item]));
          for (const item of backup.visionBoardItems || []) {
            if (item && item.id) {
              currentVisionMap.set(item.id, item);
            }
          }

          // 7. Quran Juz Selesai
          const mergedJuz = Array.from(new Set([...(current.quranCompletedJuz || []), ...(backup.quranCompletedJuz || [])]));

          // 8. Quran Tadabbur List
          const currentTadabburMap = new Map((current.quranTadabburList || []).map(item => [item.id, item]));
          for (const item of backup.quranTadabburList || []) {
            if (item && item.id) {
              currentTadabburMap.set(item.id, item);
            }
          }

          // 9. Kajian Notes
          const currentKajianMap = new Map((current.kajianNotes || []).map(item => [item.id, item]));
          for (const item of backup.kajianNotes || []) {
            if (item && item.id) {
              currentKajianMap.set(item.id, item);
            }
          }

          // 10. Gratitude Map
          const mergedGratitude = { ...(current.gratitudeMap || {}) };
          for (const [date, list] of Object.entries(backup.gratitudeMap || {})) {
            if (Array.isArray(list)) {
              mergedGratitude[date] = Array.from(new Set([...(mergedGratitude[date] || []), ...list]));
            }
          }

          // 11. Future Letters
          const currentLettersMap = new Map((current.futureLetters || []).map(item => [item.id, item]));
          for (const item of backup.futureLetters || []) {
            if (item && item.id) {
              currentLettersMap.set(item.id, item);
            }
          }

          const calculatedTasbihLifetime = Math.max(
            current.tasbihTotalLifetime || 0,
            backup.tasbihTotalLifetime || 0,
            Object.values(mergedTasbihMap).reduce((acc, curr) => acc + (curr.totalCount || 0), 0)
          );

          set({
            completedAmalan: mergedAmalan,
            hajatList: Array.from(currentHajatMap.values()),
            sedekahLogs: Array.from(currentSedekahMap.values()),
            dailyTasbihMap: mergedTasbihMap,
            tasbihTotalLifetime: calculatedTasbihLifetime,
            glowUpMap: mergedGlowUp,
            visionBoardItems: Array.from(currentVisionMap.values()),
            quranCompletedJuz: mergedJuz,
            ...(backup.quranBookmark ? { quranBookmark: backup.quranBookmark } : {}),
            ...(backup.quranPaceMode ? { quranPaceMode: backup.quranPaceMode } : {}),
            dailyCicilSholatMap: { ...(current.dailyCicilSholatMap || {}), ...(backup.dailyCicilSholatMap || {}) },
            quranTadabburList: Array.from(currentTadabburMap.values()),
            kajianNotes: Array.from(currentKajianMap.values()),
            gratitudeMap: mergedGratitude,
            futureLetters: Array.from(currentLettersMap.values()),
          });
        }

        const updatedState = get();
        return {
          success: true,
          message: mode === 'replace' 
            ? 'Seluruh data berhasil dipulihkan dan digantikan dari file cadangan.' 
            : 'Data cadangan berhasil digabungkan dengan progres yang sedang berjalan.',
          stats: {
            amalanDays: Object.keys(updatedState.completedAmalan || {}).length,
            hajatCount: (updatedState.hajatList || []).length,
            sedekahCount: (updatedState.sedekahLogs || []).length,
            tasbihDays: Object.keys(updatedState.dailyTasbihMap || {}).length,
            glowUpDays: Object.keys(updatedState.glowUpMap || {}).length,
          }
        };
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
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Selalu pastikan tanggal otomatis mengikuti tanggal hari ini saat aplikasi baru dibuka
          const todayStr = getTodayDateString();
          const [y, m] = todayStr.split('-').map(Number);
          state.selectedDate = todayStr;
          state.calendarYear = y;
          state.calendarMonth = m - 1;
          if (!state.roadmapFeatures || state.roadmapFeatures.length === 0) {
            state.roadmapFeatures = ROADMAP_FEATURES;
          } else {
            // Pastikan setiap fitur memiliki array milestones dan flag isDraft
            state.roadmapFeatures = state.roadmapFeatures.map((f) => {
              const withDraft = {
                ...f,
                isDraft: f.isDraft ?? false
              };
              if (!f.milestones || f.milestones.length === 0) {
                const defaultList = DEFAULT_ROADMAP_MILESTONES.map((m, idx) => {
                  const threshold = (idx + 1) * 20;
                  return {
                    ...m,
                    isCompleted: (f.progressPercent || 0) >= threshold - 5
                  };
                });
                return {
                  ...withDraft,
                  milestones: defaultList
                };
              }
              return withDraft;
            });
          }

          // Reset suara vote inovasi menjadi 0 murni untuk pemilihan oleh user real
          if (!state.isFeatureVotesResetV1) {
            state.featureVotes = {
              kiblat_adzan: 0,
              rapor_pdf: 0,
              kalkulator_zakat: 0,
              soundscape_murottal: 0,
              future_letters: 0,
            };
            state.userVotedFeatures = [];
            state.isFeatureVotesResetV1 = true;
          }
        }
      },
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
