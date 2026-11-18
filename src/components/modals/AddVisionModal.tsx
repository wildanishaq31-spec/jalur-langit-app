'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Sparkles, 
  Pencil, 
  Camera, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  CheckCircle, 
  Trash2, 
  Loader2 
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { VisionBoardItem } from '@/types';

interface AddVisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem?: VisionBoardItem | null;
}

const CATEGORIES: { value: VisionBoardItem['category']; label: string; icon: string }[] = [
  { value: 'spiritual', label: 'Spiritual & Ibadah (Umrah/Haji)', icon: '🕌' },
  { value: 'finansial', label: 'Finansial & Tabungan', icon: '💰' },
  { value: 'karir', label: 'Karir & Bisnis', icon: '💼' },
  { value: 'kesehatan', label: 'Kesehatan & Glow Up', icon: '🌿' },
  { value: 'lifestyle', label: 'Lifestyle & Liburan', icon: '✈️' },
  { value: 'impian', label: 'Impian Lainnya', icon: '✨' },
];

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';

// Helper to compress images to < 150KB JPEG to safely fit inside localStorage
const compressImageFile = (file: File, maxWidth = 1000, maxHeight = 1000, quality = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const AddVisionModal: React.FC<AddVisionModalProps> = ({
  isOpen,
  onClose,
  editingItem,
}) => {
  const { addVisionItem, updateVisionItem } = useJalurLangitStore();
  const [mounted, setMounted] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<VisionBoardItem['category']>('spiritual');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setCategory(editingItem.category || 'spiritual');
      setImageUrl(editingItem.imageUrl || '');
      setDescription(editingItem.description || '');
      setTargetDate(editingItem.targetDate || '');
      setShowUrlInput(Boolean(editingItem.imageUrl && !editingItem.imageUrl.startsWith('data:')));
    } else {
      setTitle('');
      setCategory('spiritual');
      setImageUrl('');
      setDescription('');
      setTargetDate('');
      setShowUrlInput(false);
    }
  }, [editingItem, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      setIsProcessingImage(true);
      const compressedBase64 = await compressImageFile(file);
      setImageUrl(compressedBase64);
    } catch (err) {
      console.error('Gagal memproses gambar:', err);
      alert('Terjadi kesalahan saat memproses gambar. Silakan coba lagi.');
    } finally {
      setIsProcessingImage(false);
      // Reset input value so same file can be re-selected if needed
      e.target.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalImage = imageUrl.trim() || DEFAULT_FALLBACK_IMAGE;

    if (editingItem) {
      updateVisionItem(editingItem.id, {
        title: title.trim(),
        category,
        imageUrl: finalImage,
        description: description.trim(),
        targetDate: targetDate || undefined,
      });
    } else {
      addVisionItem({
        title: title.trim(),
        category,
        imageUrl: finalImage,
        description: description.trim(),
        targetDate: targetDate || undefined,
      });
    }

    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-35 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 pb-24 flex items-center justify-center animate-fade-in">
      {/* Hidden file inputs for Gallery & Rear Camera */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelected}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelected}
        className="hidden"
      />

      <div className="relative w-full max-w-lg my-auto bg-white dark:bg-emerald-950 rounded-3xl shadow-2xl border border-stone-200 dark:border-emerald-800 text-stone-900 dark:text-stone-100 max-h-[85vh] flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 p-5 pb-4 border-b border-stone-100 dark:border-emerald-900/60 flex items-center justify-between flex-shrink-0 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              {editingItem ? <Pencil className="w-5 h-5" /> : <Sparkles className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-emerald-900 dark:text-emerald-100">
                {editingItem ? 'Edit Impian Vision Board' : 'Tambah Impian ke Vision Board'}
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {editingItem
                  ? 'Perbarui visualisasi impian, doa, atau ganti foto impianmu.'
                  : 'Visualisasikan cita-cita besarmu dengan foto nyata atau galeri.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-emerald-900/50 transition-colors"
            title="Tutup Popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 scrollbar-thin">
          {/* Judul & Kategori Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
                Judul Impian <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Umrah Akbar / Beli Rumah"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
                Kategori Impian
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VisionBoardItem['category'])}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value} className="dark:bg-emerald-950">
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Foto Impian (Kamera Belakang / Galeri / URL) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300">
              Foto Impian (Visualisasi)
            </label>

            {/* Image Preview if available */}
            {imageUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-emerald-800 group h-36 bg-stone-900">
                <img
                  src={imageUrl}
                  alt="Preview Impian"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                  }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white/90 text-stone-800 text-[11px] font-bold shadow flex items-center gap-1 hover:bg-white"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ulang Foto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white/90 text-stone-800 text-[11px] font-bold shadow flex items-center gap-1 hover:bg-white"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Ganti Galeri</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="p-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow"
                    title="Hapus Foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl border-2 border-dashed border-stone-200 dark:border-emerald-800/80 bg-stone-50/50 dark:bg-emerald-950/30 flex flex-col items-center justify-center text-center space-y-3">
                {isProcessingImage ? (
                  <div className="flex items-center gap-2 py-4 text-xs text-stone-500 dark:text-stone-400">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                    <span>Sedang memproses & mengoptimasi gambar...</span>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-center gap-2 w-full">
                      {/* Tombol Kamera Belakang */}
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex-1 min-w-[140px] py-2.5 px-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Kamera Belakang</span>
                      </button>

                      {/* Tombol Ambil dari Galeri */}
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="flex-1 min-w-[140px] py-2.5 px-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>Ambil di Galeri</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 w-full pt-1">
                      <span className="text-[11px] text-stone-400">atau</span>
                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="text-[11px] font-semibold text-stone-500 hover:text-emerald-600 dark:text-stone-400 dark:hover:text-emerald-300 underline flex items-center gap-1"
                      >
                        <LinkIcon className="w-3 h-3" />
                        <span>{showUrlInput ? 'Tutup Input Link' : 'Gunakan Link URL Gambar'}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Input URL opsional */}
            {showUrlInput && (
              <div className="pt-1">
                <input
                  type="url"
                  placeholder="Paste URL foto: https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
                />
              </div>
            )}
          </div>

          {/* Target Waktu */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Target Waktu Tercapai (Opsional)
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
            />
          </div>

          {/* Deskripsi & Doa Spesifik */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
              Deskripsi & Doa Spesifik
            </label>
            <textarea
              rows={2}
              placeholder="Mengapa impian ini penting bagimu dan apa doa spesifikmu kepada Allah SWT..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/30 border border-stone-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
            />
          </div>

          {/* Tombol Simpan */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessingImage}
              className="w-full py-3 px-4 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] text-xs text-white bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/25"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{editingItem ? 'Simpan Perubahan Impian' : 'Simpan ke Vision Board'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
