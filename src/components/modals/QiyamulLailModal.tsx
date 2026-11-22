'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { 
  X, 
  Moon, 
  Sparkles, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Copy, 
  CheckCheck, 
  ShieldCheck, 
  Heart, 
  Award, 
  Flame, 
  BookOpen, 
  RotateCcw,
  Volume2
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { ActiveTab } from '@/types';

interface QiyamulLailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: ActiveTab, subTab?: string, meta?: any) => void;
}

interface QiyamStep {
  id: number;
  amalanId?: string;
  name: string;
  arabicName: string;
  category: string;
  rakaat?: string;
  description: string;
  niat: {
    arabic: string;
    latin: string;
    translation: string;
  };
  kaifiyah: string[];
  doa?: {
    title: string;
    arabic: string;
    latin: string;
    translation: string;
  };
  dalil: {
    source: string;
    grade: string;
    text: string;
  };
}

const QIYAM_STEPS: QiyamStep[] = [
  {
    id: 1,
    amalanId: 'sholat_taubat',
    name: 'Sholat Taubat',
    arabicName: 'صلاة التوبة',
    category: 'Pembersih Diri Sebelum Bermunajat',
    rakaat: '2 Rakaat',
    description: 'Awali malam dengan membersihkan hati dari segala dosa, kekhilafan, dan maksiat agar pintu langit terbuka lebar menyambut munajat.',
    niat: {
      arabic: 'أُصَلِّي سُنَّةَ التَّوْبَةِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: "Usholli sunnatat taubati rok'ataini lillaahi Ta'aala.",
      translation: 'Aku niat sholat sunnah Taubat dua rakaat karena Allah Ta\'ala.'
    },
    kaifiyah: [
      'Berwudhu dengan sempurna di sepertiga malam terakhir.',
      'Sholat 2 rakaat. Rakaat 1 membaca Al-Fatihah dan Al-Kafirun, rakaat 2 membaca Al-Fatihah dan Al-Ikhlas.',
      'Pada sujud terakhir sebelum salam, perbanyak membaca tasbih Nabi Yunus: "Laa ilaaha illaa anta subhaanaka innii kuntu minazh zhaalimiin".',
      'Setelah salam, perbanyak istighfar dengan penuh penyesalan dan tekad tidak mengulangi dosa.'
    ],
    doa: {
      title: 'Doa Ba\'da Sholat Taubat',
      arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
      latin: "Astaghfirullahal 'azhiim alladzii laa ilaaha illaa huwal hayyul qayyuumu wa atuubu ilaih.",
      translation: 'Aku memohon ampunan kepada Allah Yang Maha Agung, tiada Tuhan selain Dia Yang Maha Hidup lagi Maha Berdiri Sendiri, dan aku bertaubat kepada-Nya.'
    },
    dalil: {
      source: 'HR. Abu Dawud no. 1521 & Tirmidzi no. 406',
      grade: 'Hasan',
      text: 'Tidaklah seorang hamba melakukan suatu dosa, lalu ia bersuci dengan baik, kemudian berdiri sholat dua rakaat dan memohon ampun kepada Allah, melainkan Allah pasti mengampuninya.'
    }
  },
  {
    id: 2,
    amalanId: 'tahajjud',
    name: 'Sholat Tahajjud',
    arabicName: 'صلاة التهجد',
    category: 'Amalan Inti Sepertiga Malam',
    rakaat: 'Minimal 2 Rakaat',
    description: 'Sholat sunnah paling mulia setelah sholat fardhu, dikerjakan setelah tidur di sepertiga malam terakhir saat rahmat Allah turun.',
    niat: {
      arabic: 'أُصَلِّي سُنَّةَ التَّهَجُّدِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: "Usholli sunnatat tahajjudi rok'ataini lillaahi Ta'aala.",
      translation: 'Aku niat sholat sunnah Tahajjud dua rakaat karena Allah Ta\'ala.'
    },
    kaifiyah: [
      'Dikerjakan minimal 2 rakaat dengan salam setiap 2 rakaat (bisa 2, 4, 8 rakaat).',
      'Baca surat yang dihafal dengan tartil dan penuh penghayatan makna.',
      'Perpanjang ruku\' dan sujud sebagai bentuk ketundukan tertinggi hamba.',
      'Pada sujud terakhir sebelum salam, curahkan seluruh doa, impian, dan beban hidup Anda kepada Allah.'
    ],
    doa: {
      title: 'Doa Sholat Tahajjud (HR. Bukhari no. 1120)',
      arabic: 'اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ قَيِّمُ السَّمَاوَاتِ وَالْأَرْضِ وَمَنْ فِيهِنَّ، وَلَكَ الْحَمْدُ أَنْتَ نُورُ السَّمَاوَاتِ وَالْأَرْضِ وَمَنْ فِيهِنَّ، أَنْتَ الْحَقُّ وَوَعْدُكَ الْحَقُّ',
      latin: "Allahumma lakal hamdu anta qayyimus samawati wal ardhi wa man fiihinna, wa lakal hamdu anta nuurus samawati wal ardhi wa man fiihinna, antal haqqu wa wa'dukal haqqu.",
      translation: 'Ya Allah, bagi-Mu lah segala puji, Engkaulah Pemelihara langit dan bumi beserta isinya. Bagi-Mu segala puji, Engkaulah Cahaya langit dan bumi beserta isinya. Engkaulah Yang Maha Benar dan janji-Mu adalah benar.'
    },
    dalil: {
      source: 'QS. Al-Isra: 79 & HR. Muslim no. 1163',
      grade: 'Al-Qur\'an & Shahih',
      text: 'Dan pada sebagian malam hari bertahajudlah kamu sebagai ibadah tambahan bagimu; mudah-mudahan Tuhan-mu mengangkat kamu ke tempat yang terpuji. (QS. Al-Isra: 79)'
    }
  },
  {
    id: 3,
    amalanId: 'sholat_hajat',
    name: 'Sholat Hajat',
    arabicName: 'صلاة الحاجة',
    category: 'Munajat Hajat Khusus (Opsional)',
    rakaat: '2 Rakaat',
    description: 'Dikerjakan 2 rakaat saat Anda memiliki kebutuhan mendesak, hajat besar dunia-akhirat, atau sedang menghadapi jalan buntu.',
    niat: {
      arabic: 'أُصَلِّي سُنَّةَ الْحَاجَةِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: "Usholli sunnatal haajati rok'ataini lillaahi Ta'aala.",
      translation: 'Aku niat sholat sunnah Hajat dua rakaat karena Allah Ta\'ala.'
    },
    kaifiyah: [
      'Dikerjakan 2 rakaat secara tenang dan khusyuk.',
      'Rakaat 1 membaca Al-Fatihah dan Ayat Kursi, rakaat 2 membaca Al-Fatihah dan Al-Ikhlas (atau surat yang dihafal).',
      'Selesai salam, membaca pujian kepada Allah, sholawat atas Nabi SAW, lalu membaca doa Sholat Hajat.'
    ],
    doa: {
      title: 'Doa Sholat Hajat (HR. Tirmidzi no. 479)',
      arabic: 'لَا إِلَهَ إِلَّا اللَّهُ الْحَلِيمُ الْكَرِيمُ، سُبْحَانَ اللَّهِ رَبِّ الْعَرْشِ الْعَظِيمِ، الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، أَسْأَلُكَ مُوجِبَاتِ رَحْمَتِكَ وَعَزَائِمَ مَغْفِرَتِكَ',
      latin: "Laa ilaaha illallahul haliimul kariim, subhaanallahi rabbil 'arsyil 'azhiim, alhamdulillahi rabbil 'aalamiin, as-aluka muujibaati rahmatika wa 'azaa-ima maghfiratika.",
      translation: 'Tiada Tuhan selain Allah Yang Maha Penyantun lagi Maha Mulia. Maha Suci Allah Rabb Pemilik Arsy yang agung. Segala puji bagi Allah Rabb semesta alam. Aku memohon kepada-Mu hal-hal yang mendatangkan rahmat-Mu dan ketetapan ampunan-Mu.'
    },
    dalil: {
      source: 'HR. Tirmidzi no. 479 & Ibnu Majah no. 1384',
      grade: 'Hasan',
      text: 'Barangsiapa memiliki hajat kepada Allah atau kepada salah seorang anak cucu Adam, hendaklah ia berwudhu dengan baik kemudian sholat dua rakaat lalu memuji Allah dan bersholawat kepada Nabi.'
    }
  },
  {
    id: 4,
    amalanId: 'witir',
    name: 'Sholat Witir',
    arabicName: 'صلاة الوتر',
    category: 'Penutup Seluruh Sholat Malam',
    rakaat: '1 atau 3 Rakaat',
    description: 'Kunci penutup seluruh rangkaian sholat sunnah malam hari. Jangan lewatkan witir walau hanya 1 rakaat.',
    niat: {
      arabic: 'أُصَلِّي سُنَّةَ الْوِتْرِ ثَلَاثَ رَكَعَاتٍ لِلَّهِ تَعَالَى',
      latin: "Usholli sunnatal witri tsalaatsa roka'aatin lillaahi Ta'aala.",
      translation: 'Aku niat sholat sunnah Witir tiga rakaat karena Allah Ta\'ala.'
    },
    kaifiyah: [
      'Dikerjakan 3 rakaat (bisa 2 rakaat salam disambung 1 rakaat salam, atau 3 rakaat langsung).',
      'Rakaat 1 membaca Surat Al-A\'la, rakaat 2 membaca Surat Al-Kafirun, rakaat 3 membaca Al-Ikhlas, Al-Falaq, dan An-Nas.',
      'Setelah salam, membaca dzikir: "Subhanal Malikil Quddus" (3x).'
    ],
    doa: {
      title: 'Dzikir Selesai Witir',
      arabic: 'سُبْحَانَ الْمَلِكِ الْقُدُّوسِ (٣×)، رَبِّ الْمَلَائِكَةِ وَالرُّوحِ',
      latin: "Subhanal malikil qudduus (3x), rabbil malaaikati war ruuh.",
      translation: 'Maha Suci Allah Penguasa Yang Maha Suci (3x), Tuhan para malaikat dan ruh (Jibril).'
    },
    dalil: {
      source: 'HR. Bukhari no. 998 & Muslim no. 751',
      grade: 'Shahih',
      text: 'Jadikanlah akhir sholat kalian di malam hari adalah sholat witir. (HR. Bukhari & Muslim)'
    }
  },
  {
    id: 5,
    amalanId: 'istighfar_sahur',
    name: 'Sayyidul Istighfar & Dzikir Sahur',
    arabicName: 'الاستغفار بالأسحار',
    category: 'Menjelang Fajar Subuh (100x)',
    rakaat: 'Duduk Dzikir',
    description: 'Duduk dengan tenang sekitar 15–30 menit menjelang adzan Subuh untuk membasahi lisan dengan istighfar penghapus dosa.',
    niat: {
      arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ',
      latin: "Astaghfirullahal 'adzim wa atubu ilaih.",
      translation: 'Aku memohon ampunan kepada Allah Yang Maha Agung dan bertaubat kepada-Nya.'
    },
    kaifiyah: [
      'Duduk bersimpuh menghadap kiblat dengan tenang.',
      'Awali dengan membaca Sayyidul Istighfar (1x atau 3x).',
      'Lanjutkan dengan melafadzkan istighfar pendek sebanyak 100x ketukan.',
      'Gunakan tombol Tasbih Digital jika ingin penghitungan terpandu.'
    ],
    doa: {
      title: 'Lafadz Sayyidul Istighfar (HR. Bukhari no. 6306)',
      arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي',
      latin: "Allahumma anta rabbii laa ilaaha illaa anta, khalaqtanii wa anaa 'abduka, wa anaa 'alaa 'ahdika wa wa'dika mastatha'tu, abuu-u laka bini'matika 'alayya, wa abuu-u laka bidzanbii faghfir lii.",
      translation: 'Ya Allah, Engkaulah Tuhanku, tiada Tuhan selain Engkau. Engkaulah yang menciptakan aku dan aku adalah hamba-Mu. Aku senantiasa setia pada janji-Mu semampuku. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku kepada-Mu, maka ampunilah aku.'
    },
    dalil: {
      source: 'QS. Adz-Dzariyat: 18',
      grade: 'Al-Qur\'an',
      text: 'Dan pada akhir-akhir malam (waktu sahur) mereka senantiasa memohon ampunan kepada Allah. (QS. Adz-Dzariyat: 18)'
    }
  },
  {
    id: 6,
    amalanId: 'hajat_dini_hari',
    name: 'Munajat Doa Sepertiga Malam',
    arabicName: 'مناجاة الثلث الأخير',
    category: 'Puncak Pengabulan Doa',
    rakaat: 'Munajat Pribadi',
    description: 'Waktu puncak di mana Allah SWT turun ke langit dunia dan berjanji mengabulkan doa setiap hamba yang berseru.',
    niat: {
      arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',
      latin: "Ya Hayyu Ya Qayyum, birahmatika astaghits.",
      translation: 'Wahai Yang Maha Hidup, wahai Yang Berdiri Sendiri, dengan rahmat-Mu aku memohon pertolongan.'
    },
    kaifiyah: [
      'Tengadahkan kedua telapak tangan setinggi dada.',
      'Awali dengan memuji Allah (Alhamdulillah) dan bersholawat atas Nabi Muhammad SAW.',
      'Sebutkan satu per satu hajat spesifik Anda: impian rezeki, pelunasan hutang, kesembuhan, jodoh, atau keluarga.',
      'Yakin 100% di dalam hati bahwa Allah telah mendengar dan sedang menyiapkan waktu terbaik untuk mengabulkannya.'
    ],
    dalil: {
      source: 'HR. Bukhari no. 1145 & Muslim no. 758',
      grade: 'Shahih',
      text: 'Siapa yang berdoa kepada-Ku niscaya Aku kabulkan, siapa yang meminta kepada-Ku niscaya Aku beri, dan siapa yang memohon ampun niscaya Aku ampuni. (HR. Bukhari & Muslim)'
    }
  }
];

export const QiyamulLailModal: React.FC<QiyamulLailModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const { 
    selectedDate, 
    markAmalanCompleted, 
    isAmalanCompleted, 
    hajatList 
  } = useJalurLangitStore();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<boolean>(false);
  const [quickCounter, setQuickCounter] = useState(0);

  const step = QIYAM_STEPS[currentStepIndex];
  const isStepDone = step.amalanId ? isAmalanCompleted(selectedDate, step.amalanId) : false;

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleCurrentStep = () => {
    if (step.amalanId) {
      markAmalanCompleted(selectedDate, step.amalanId);
    }
  };

  const handleNextStep = () => {
    // Otomatis tandai amalan terkait jika ada
    if (step.amalanId) {
      markAmalanCompleted(selectedDate, step.amalanId);
    }

    if (currentStepIndex < QIYAM_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Selesai seluruh alur Qiyamul Lail
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0f3d2e', '#c9933b', '#2dd4bf', '#fbbf24']
      });
      onClose();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleCopyText = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedIndex(true);
      setTimeout(() => setCopiedIndex(false), 2500);
    } catch {}
  };

  // Filter hajat aktif untuk langkah 6
  const activeHajats = (hajatList || []).filter(h => h.status === 'berikhtiar' || h.status === 'menunggu');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/70 dark:bg-black/85 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0c1813] rounded-t-3xl sm:rounded-3xl border border-stone-200 dark:border-emerald-800/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] text-stone-900 dark:text-stone-100 z-10">
        
        {/* 1. HEADER MODAL WITH STEPS PROGRESS */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-950 via-[#072418] to-emerald-900 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-bold shadow-md">
                <Moon className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold font-serif text-amber-300 tracking-tight">
                  Alur Terpadu Qiyamul Lail
                </h2>
                <p className="text-[10px] text-emerald-200/80">
                  Panduan Runtut Sepertiga Malam Terakhir
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-800/50 transition-colors"
              title="Tutup Panduan"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Navigation Dots Bar */}
          <div className="grid grid-cols-6 gap-1.5 pt-2">
            {QIYAM_STEPS.map((s, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              const isCompleted = s.amalanId ? isAmalanCompleted(selectedDate, s.amalanId) : false;

              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`py-1 px-1 rounded-xl text-center flex flex-col items-center gap-0.5 transition-all ${
                    isActive
                      ? 'bg-amber-400 text-stone-900 font-extrabold shadow-sm scale-105'
                      : isCompleted || isPast
                      ? 'bg-emerald-800/80 text-emerald-200 hover:bg-emerald-700/80'
                      : 'bg-emerald-900/40 text-emerald-400/70 hover:bg-emerald-900/70'
                  }`}
                  title={`${s.id}. ${s.name}`}
                >
                  <span className="text-[10px]">{s.id}</span>
                  <span className="text-[8px] truncate w-full block">
                    {s.name.split(' ')[1] || s.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. BODY CONTENT (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Step Category & Title Card */}
          <div className="p-4 rounded-3xl bg-stone-50 dark:bg-emerald-950/40 border border-stone-200/80 dark:border-emerald-800/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                Langkah {step.id} dari 6 • {step.category}
              </span>

              {step.rakaat && (
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{step.rakaat}</span>
                </span>
              )}
            </div>

            <div className="flex items-baseline justify-between gap-2 pt-1">
              <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100">
                {step.name}
              </h3>
              <span className="font-arabic text-base text-emerald-800 dark:text-amber-300 dir-rtl">
                {step.arabicName}
              </span>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              {step.description}
            </p>
          </div>

          {/* Niat & Kaifiyah Ringkas */}
          <div className="p-4 rounded-3xl bg-stone-50 dark:bg-emerald-950/30 border border-stone-200/80 dark:border-emerald-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Niat & Kaifiyah Pelaksanaan</span>
              </span>

              <button
                onClick={() => handleCopyText(`${step.niat.arabic}\n${step.niat.latin}\n${step.niat.translation}`)}
                className="text-[10px] text-stone-500 hover:text-emerald-700 flex items-center gap-1"
                title="Salin Niat"
              >
                {copiedIndex ? <CheckCheck className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>

            {/* Arabic Niat */}
            <div className="p-3 rounded-2xl bg-white dark:bg-emerald-900/30 border border-stone-100 dark:border-emerald-900/40">
              <p className="font-arabic text-base sm:text-lg text-right dir-rtl leading-loose text-stone-900 dark:text-stone-100 font-medium">
                {step.niat.arabic}
              </p>
            </div>

            {/* Latin & Translation */}
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-stone-800 dark:text-stone-200 italic leading-relaxed">
                "{step.niat.latin}"
              </p>
              <p className="text-stone-500 leading-relaxed text-[11px]">
                Artinya: {step.niat.translation}
              </p>
            </div>

            {/* Kaifiyah Steps */}
            <div className="pt-2 border-t border-stone-200/60 dark:border-emerald-900/40 space-y-2">
              <span className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block">
                Urutan Pengerjaan:
              </span>
              <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                {step.kaifiyah.map((k, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{k}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Doa Ba'da Sholat (jika ada) */}
          {step.doa && (
            <div className="p-4 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 dark:text-amber-300">
                  {step.doa.title}
                </span>

                <button
                  onClick={() => handleCopyText(`${step.doa?.arabic}\n${step.doa?.latin}\n${step.doa?.translation}`)}
                  className="text-[10px] text-emerald-800 dark:text-emerald-300 hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Salin Doa</span>
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50">
                <p className="font-arabic text-base sm:text-lg text-right dir-rtl leading-loose text-stone-900 dark:text-stone-100">
                  {step.doa.arabic}
                </p>
              </div>

              <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 italic leading-relaxed">
                "{step.doa.latin}"
              </p>

              <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                Artinya: {step.doa.translation}
              </p>
            </div>
          )}

          {/* Special Feature on Step 5: Quick Counter for Istighfar Sahur */}
          {step.id === 5 && (
            <div className="p-4 rounded-3xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Ketukan Istighfar Sahur (Target 100x)</span>
                </span>

                <span className="text-sm font-extrabold text-amber-900 dark:text-amber-200">
                  {quickCounter} / 100
                </span>
              </div>

              <div className="w-full bg-amber-200/70 dark:bg-amber-900/40 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-amber-500 h-full transition-all duration-200"
                  style={{ width: `${Math.min(100, quickCounter)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setQuickCounter(prev => Math.min(100, prev + 1))}
                  className="py-2.5 px-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+1 Ketukan Istighfar</span>
                </button>

                <Link
                  href="/tasbih"
                  onClick={() => {
                    if (onNavigateToTab) {
                      onNavigateToTab('tasbih', undefined, { presetId: 'istighfar_sahur' });
                    }
                    onClose();
                  }}
                  className="py-2.5 px-3 rounded-2xl bg-white dark:bg-emerald-900/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-bold text-xs shadow-2xs hover:bg-amber-100 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Buka Tasbih Digital ↗</span>
                </Link>
              </div>
            </div>
          )}

          {/* Special Feature on Step 6: Daftar Hajat Aktif Pengguna */}
          {step.id === 6 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Daftar Hajat Impian Kamu Malam Ini:</span>
                </h4>
                <span className="text-[10px] text-stone-400">
                  {activeHajats.length} Doa Aktif
                </span>
              </div>

              {activeHajats.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeHajats.map((hajat) => (
                    <div 
                      key={hajat.id}
                      className="p-3 rounded-2xl bg-stone-50 dark:bg-emerald-950/40 border border-stone-200/80 dark:border-emerald-800/50 space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-stone-100">
                        <span>{hajat.title}</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-sm bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                          {hajat.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-300 italic">
                        "{hajat.specificDua}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-950/30 border border-stone-200/70 text-center text-xs text-stone-500">
                  Belum ada catatan hajat di Papan Hajat. Kamu bisa langsung berdoa menyampaikan apa saja isi hatimu.
                </div>
              )}
            </div>
          )}

          {/* Dalil Shahih Box */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-950/30 border border-stone-200/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-stone-600 dark:text-stone-300 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>{step.dalil.source}</span>
              </span>
              <span className="text-[9.5px] uppercase font-extrabold px-1.5 py-0.5 rounded-sm bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                {step.dalil.grade}
              </span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-300 italic leading-relaxed">
              "{step.dalil.text}"
            </p>
          </div>

        </div>

        {/* 3. FOOTER NAVIGATION CONTROLS */}
        <div className="p-4 border-t border-stone-200/80 dark:border-emerald-800/60 bg-stone-50/80 dark:bg-emerald-950/40 flex items-center justify-between gap-2">
          {/* Tombol Sebelumnya */}
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className={`py-2 px-3 rounded-2xl text-xs font-bold flex items-center gap-1 transition-all ${
              currentStepIndex === 0
                ? 'opacity-40 cursor-not-allowed text-stone-400'
                : 'bg-white dark:bg-emerald-900/50 border border-stone-200 dark:border-emerald-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          {/* Tombol Checklist Langkah Ini */}
          {step.amalanId && (
            <button
              onClick={handleToggleCurrentStep}
              className={`py-2 px-3 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
                isStepDone
                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                  : 'bg-stone-100 dark:bg-emerald-950 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-emerald-800'
              }`}
            >
              <Check className={`w-3.5 h-3.5 stroke-[3] ${isStepDone ? 'text-emerald-600' : 'text-stone-400'}`} />
              <span className="text-[11px]">{isStepDone ? 'Tercatat Selesai' : 'Tandai Selesai'}</span>
            </button>
          )}

          {/* Tombol Lanjut / Selesai */}
          <button
            onClick={handleNextStep}
            className="py-2.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <span>{currentStepIndex === QIYAM_STEPS.length - 1 ? 'Selesai Qiyamul Lail 🌙' : 'Langkah Selanjutnya'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
