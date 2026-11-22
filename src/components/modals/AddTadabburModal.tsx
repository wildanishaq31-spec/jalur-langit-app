'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  BookOpen, 
  CheckCircle, 
  Edit3, 
  Wand2, 
  Sparkles, 
  ChevronDown, 
  CheckCircle2, 
  Search,
  BookMarked
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { QuranTadabburItem } from '@/types';
import { ALL_114_SURAHS, generateSmartTadabbur } from '@/data/quranSurahCatalog';

interface AddTadabburModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem?: QuranTadabburItem | null;
}

export const AddTadabburModal: React.FC<AddTadabburModalProps> = ({ isOpen, onClose, editingItem }) => {
  const { addQuranTadabbur, updateQuranTadabbur } = useJalurLangitStore();

  const [surahName, setSurahName] = useState('');
  const [ayahRange, setAyahRange] = useState('');
  const [arabicText, setArabicText] = useState('');
  const [latinText, setLatinText] = useState('');
  const [translationText, setTranslationText] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [story, setStory] = useState('');
  const [topic, setTopic] = useState('');
  const [wisdom, setWisdom] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [mounted, setMounted] = useState(false);

  // Smart Auto-Generator State
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(94); // Default: QS. Al-Insyirah
  const [surahSearchQuery, setSurahSearchQuery] = useState('');
  const [generatedNotice, setGeneratedNotice] = useState<string | null>(null);

  const isEditing = Boolean(editingItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editingItem) {
      setSurahName(editingItem.surahName || '');
      setAyahRange(editingItem.ayahRange || '');
      setArabicText(editingItem.arabicText || '');
      setLatinText(editingItem.latinText || '');
      setTranslationText(editingItem.translationText || '');
      setYoutubeLink(editingItem.youtubeLink || '');
      setStory(editingItem.story || '');
      setTopic(editingItem.topic || '');
      setWisdom(editingItem.wisdom || '');
      setActionPlan(editingItem.actionPlan || '');
      setGeneratedNotice(null);
    } else {
      setSurahName('');
      setAyahRange('');
      setArabicText('');
      setLatinText('');
      setTranslationText('');
      setYoutubeLink('');
      setStory('');
      setTopic('');
      setWisdom('');
      setActionPlan('');
      setGeneratedNotice(null);
    }
  }, [editingItem, isOpen]);

  // Filter 114 Surahs by search query
  const filteredSurahs = useMemo(() => {
    if (!surahSearchQuery.trim()) return ALL_114_SURAHS;
    const q = surahSearchQuery.toLowerCase();
    return ALL_114_SURAHS.filter(
      s => s.name.toLowerCase().includes(q) ||
           s.meaning.toLowerCase().includes(q) ||
           String(s.number).includes(q)
    );
  }, [surahSearchQuery]);

  // Handler for 1-Click Smart Auto-Generate
  const handleApplySmartGenerate = (surahNum: number) => {
    setSelectedSurahNumber(surahNum);
    const tpl = generateSmartTadabbur(surahNum);

    setSurahName(tpl.surahName);
    setAyahRange(tpl.ayahRange);
    setArabicText(tpl.arabicText);
    setLatinText(tpl.latinText);
    setTranslationText(tpl.translationText);
    setStory(tpl.story);
    setTopic(tpl.topic);
    setWisdom(tpl.wisdom);
    setActionPlan(tpl.actionPlan);
    if (tpl.youtubeLink) {
      setYoutubeLink(tpl.youtubeLink);
    }

    setGeneratedNotice(`✨ Seluruh kolom berhasil di-generate otomatis untuk ${tpl.surahName}! Anda bisa langsung menyimpannya atau menyesuaikan isinya.`);
  };

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surahName.trim()) return;

    if (isEditing && editingItem) {
      updateQuranTadabbur(editingItem.id, {
        surahName: surahName.trim(),
        ayahRange: ayahRange.trim() || 'Ayat Pilihan',
        arabicText: arabicText.trim() || undefined,
        latinText: latinText.trim() || undefined,
        translationText: translationText.trim() || undefined,
        youtubeLink: youtubeLink.trim() || undefined,
        story: story.trim() || '-',
        topic: topic.trim() || '-',
        wisdom: wisdom.trim() || '-',
        actionPlan: actionPlan.trim() || '-',
      });
    } else {
      addQuranTadabbur({
        surahName: surahName.trim(),
        ayahRange: ayahRange.trim() || 'Ayat Pilihan',
        arabicText: arabicText.trim() || undefined,
        latinText: latinText.trim() || undefined,
        translationText: translationText.trim() || undefined,
        youtubeLink: youtubeLink.trim() || undefined,
        story: story.trim() || '-',
        topic: topic.trim() || '-',
        wisdom: wisdom.trim() || '-',
        actionPlan: actionPlan.trim() || '-',
      });
    }

    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-emerald-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-emerald-800 text-stone-900 dark:text-stone-100 max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Fixed Header with Title & Close Button (Always visible at top) */}
        <div className="p-4 sm:p-5 pb-3 border-b border-stone-100 dark:border-emerald-900/60 flex items-center justify-between flex-shrink-0 bg-white/95 dark:bg-emerald-950/95">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${
              isEditing
                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                : 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300'
            }`}>
              {isEditing ? <Edit3 className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-stone-900 dark:text-stone-100">
                {isEditing ? 'Edit Lembar Tadabbur Al-Qur\'an' : 'Quran Journaling & Tadabbur'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {isEditing
                  ? 'Perbarui renungan, hikmah, atau rencana aksi nyata ayat ini.'
                  : 'Refleksi mendalam dan perenungan ayat suci Al-Qur\'an.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-emerald-900/50 transition-colors"
            title="Tutup Popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 scrollbar-thin">
          
          {/* FITUR CERDAS: GENERATOR TADABBUR OTOMATIS */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/70 dark:from-emerald-950/70 dark:via-teal-950/50 dark:to-emerald-900/50 border border-teal-200/80 dark:border-teal-800/70 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-pulse shrink-0" />
                <span className="text-xs font-bold text-teal-900 dark:text-teal-200">
                  Generator Tadabbur Otomatis 114 Surah
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold">
                1-Klik Cerdas
              </span>
            </div>

            <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
              Pilih surah Al-Qur&apos;an di bawah, lalu klik <b>Generate Otomatis</b>. Seluruh kolom (Arab, Latin, Terjemahan, Kisah, Topik, Hikmah, &amp; Aksi Nyata) akan terisi otomatis secara mendalam.
            </p>

            {/* Input Pencarian Cepat Surah */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Cari nama surah atau arti (cth: Waqiah, Yasin, Kahf)..."
                value={surahSearchQuery}
                onChange={(e) => setSurahSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-emerald-900/60 border border-teal-200 dark:border-teal-700 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Dropdown 114 Surah + Tombol Generate */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <select
                  value={selectedSurahNumber}
                  onChange={(e) => setSelectedSurahNumber(Number(e.target.value))}
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-white dark:bg-emerald-900/60 border border-teal-300 dark:border-teal-700 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer"
                >
                  <optgroup label="🌟 Surah Rekomendasi Utama">
                    <option value={94}>QS. 94. Al-Insyirah (Kelapangan Hati) - 8 Ayat</option>
                    <option value={2}>QS. 2. Al-Baqarah (Ayat Kursi) - 286 Ayat</option>
                    <option value={93}>QS. 93. Adh-Dhuha (Waktu Duha) - 11 Ayat</option>
                    <option value={56}>QS. 56. Al-Waqi&apos;ah (Hari Kiamat) - 96 Ayat</option>
                    <option value={67}>QS. 67. Al-Mulk (Kerajaan) - 30 Ayat</option>
                    <option value={18}>QS. 18. Al-Kahfi (Gua) - 110 Ayat</option>
                    <option value={65}>QS. 65. At-Talaq (Ayat Seribu Dinar) - 12 Ayat</option>
                    <option value={55}>QS. 55. Ar-Rahman (Maha Pengasih) - 78 Ayat</option>
                    <option value={112}>QS. 112. Al-Ikhlas (Keesaan Allah) - 4 Ayat</option>
                    <option value={1}>QS. 1. Al-Fatihah (Pembukaan) - 7 Ayat</option>
                  </optgroup>
                  <optgroup label="📖 Katalog Lengkap 114 Surah Al-Qur'an">
                    {filteredSurahs.map((s) => (
                      <option key={s.number} value={s.number}>
                        QS. {s.number}. {s.name} ({s.arabic}) - {s.meaning} [{s.ayahCount} Ayat]
                      </option>
                    ))}
                  </optgroup>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-stone-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleApplySmartGenerate(selectedSurahNumber)}
                className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
                <span>Generate Otomatis</span>
              </button>
            </div>

            {/* Quick Chips Rekomendasi Cepat (1-Klik Langsung Terisi) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium mr-0.5">Preset 1-Tap:</span>
              {[
                { num: 94, label: 'Al-Insyirah' },
                { num: 2, label: 'Ayat Kursi' },
                { num: 93, label: 'Adh-Dhuha' },
                { num: 56, label: "Al-Waqi'ah" },
                { num: 67, label: 'Al-Mulk' },
                { num: 18, label: 'Al-Kahfi' },
                { num: 65, label: '1000 Dinar' },
                { num: 55, label: 'Ar-Rahman' },
              ].map((chip) => (
                <button
                  key={chip.num}
                  type="button"
                  onClick={() => handleApplySmartGenerate(chip.num)}
                  className={`text-[10px] px-2.5 py-1 rounded-full font-semibold transition-all border cursor-pointer ${
                    selectedSurahNumber === chip.num
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'bg-white dark:bg-emerald-900/50 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-emerald-800 hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Banner Sukses Ter-generate */}
            {generatedNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-100/90 dark:bg-emerald-900/70 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 text-xs flex items-center justify-between gap-2 animate-fade-in">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-300 shrink-0" />
                  <span className="text-[11px] leading-snug">{generatedNotice}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setGeneratedNotice(null)}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Form Bagian Identitas Surah & Ayat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Nama Surah *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: QS. Al-Mulk"
                value={surahName}
                onChange={(e) => setSurahName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Ayat yang Dibaca
              </label>
              <input
                type="text"
                placeholder="Contoh: Ayat 1-5"
                value={ayahRange}
                onChange={(e) => setAyahRange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
              Link Murattal / Penjelasan (Opsional)
            </label>
            <input
              type="url"
              placeholder="https://youtube.com/..."
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Form Bagian Ayat Al-Qur'an (Arab, Latin, Terjemahan) */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2.5">
            <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <BookMarked className="w-3.5 h-3.5" />
              <span>Teks Ayat Al-Qur&apos;an (Agar Bisa Langsung Dibaca)</span>
            </span>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Teks Arab Berharakat
              </label>
              <textarea
                dir="rtl"
                rows={3}
                placeholder="Tuliskan teks Arab ayat di sini..."
                value={arabicText}
                onChange={(e) => setArabicText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-emerald-900/40 border border-stone-200 dark:border-emerald-800 text-base font-arabic leading-loose focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Transliterasi Latin
              </label>
              <textarea
                rows={2}
                placeholder="Cara pengucapan / bacaan latin ayat..."
                value={latinText}
                onChange={(e) => setLatinText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-emerald-900/40 border border-stone-200 dark:border-emerald-800 text-xs font-medium text-amber-950 dark:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Arti &amp; Terjemahan Bahasa Indonesia
              </label>
              <textarea
                rows={2}
                placeholder="Terjemahan resmi ayat dalam bahasa Indonesia..."
                value={translationText}
                onChange={(e) => setTranslationText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-emerald-900/40 border border-stone-200 dark:border-emerald-800 text-xs text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
              📜 Kisah pada Ayat (Asbabun Nuzul / Konteks)
            </label>
            <textarea
              rows={2}
              placeholder="Ceritakan latar belakang atau kisah yang ada dalam ayat ini..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
              🎯 Topik Mengenai Ayat Ini
            </label>
            <input
              type="text"
              placeholder="Contoh: Kekuasaan Allah menciptakan kematian dan kehidupan"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
              💡 Hikmah yang Didapat (Tadabbur Jiwa)
            </label>
            <textarea
              rows={2}
              placeholder="Pelajaran apa yang menyentuh hatimu saat membaca ayat ini..."
              value={wisdom}
              onChange={(e) => setWisdom(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
              🌱 Rencana Muhasabah &amp; Penerapan Sehari-hari
            </label>
            <input
              type="text"
              placeholder="Aksi konkret yang akan kulakukan mulai hari ini..."
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 bg-emerald-800 hover:bg-emerald-900 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isEditing ? 'Simpan Perubahan Tadabbur' : 'Simpan Lembar Tadabbur'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
