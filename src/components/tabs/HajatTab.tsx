'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Plus, 
  Sparkles, 
  HeartHandshake, 
  HandCoins, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Heart,
  Calendar,
  Pencil
} from 'lucide-react';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';
import { AddHajatModal } from '@/components/modals/AddHajatModal';
import { AddSedekahModal } from '@/components/modals/AddSedekahModal';
import { HajatItem, HajatStatus, SedekahItem } from '@/types';

export const HajatTab: React.FC = () => {
  const { 
    hajatList, 
    updateHajatStatus, 
    deleteHajat, 
    sedekahLogs, 
    deleteSedekah 
  } = useJalurLangitStore();

  const [activeSubTab, setActiveSubTab] = useState<'hajat' | 'sedekah'>('hajat');
  const [isHajatModalOpen, setIsHajatModalOpen] = useState(false);
  const [isSedekahModalOpen, setIsSedekahModalOpen] = useState(false);
  const [editingHajatItem, setEditingHajatItem] = useState<HajatItem | null>(null);
  const [editingSedekahItem, setEditingSedekahItem] = useState<SedekahItem | null>(null);

  // Status handler with confetti when marked 'terkabul'
  const handleStatusChange = (id: string, newStatus: HajatStatus) => {
    updateHajatStatus(id, newStatus);
    if (newStatus === 'terkabul') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0f3d2e', '#c9933b', '#fbbf24', '#22c55e']
      });
    }
  };

  const totalSedekahAmount = sedekahLogs.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="space-y-6 pb-24">
      {/* Sub-tab Navigation */}
      <div className="flex bg-stone-100 dark:bg-emerald-950/60 p-1 rounded-2xl border border-stone-200/80 dark:border-emerald-800/60">
        <button
          onClick={() => setActiveSubTab('hajat')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeSubTab === 'hajat'
              ? 'bg-white dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Hajat & Manifesting ({hajatList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sedekah')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeSubTab === 'sedekah'
              ? 'bg-white dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <HandCoins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Sedekah Subuh ({sedekahLogs.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: HAJAT & MANIFESTING */}
      {activeSubTab === 'hajat' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-serif text-stone-900 dark:text-stone-100">
                Papan Hajat & Ikhtiar Doa
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Tuliskan hajatmu secara rinci dan panjatkan di setiap waktu mustajab.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingHajatItem(null);
                setIsHajatModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Hajat</span>
            </button>
          </div>

          <div className="space-y-3">
            {hajatList.length === 0 ? (
              <div className="text-center py-12 px-4 bg-white dark:bg-emerald-950/20 rounded-3xl border border-dashed border-stone-300 dark:border-emerald-800">
                <HeartHandshake className="w-10 h-10 mx-auto text-stone-300 dark:text-emerald-700 mb-2" />
                <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                  Belum ada hajat yang dicatat.
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Mulai catat impian dan doa terbaikmu untuk 30 hari ke depan.
                </p>
              </div>
            ) : (
              hajatList.map((hajat) => {
                const isAnswered = hajat.status === 'terkabul';

                return (
                  <div
                    key={hajat.id}
                    className={`p-5 rounded-3xl border transition-all ${
                      isAnswered
                        ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60 shadow-sm'
                        : 'bg-white dark:bg-emerald-950/30 border-stone-200/80 dark:border-emerald-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 dark:bg-emerald-900/40 text-stone-600 dark:text-emerald-300">
                          {hajat.category}
                        </span>
                        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                          {hajat.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingHajatItem(hajat);
                            setIsHajatModalOpen(true);
                          }}
                          className="p-1.5 text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl hover:bg-stone-50 dark:hover:bg-emerald-900/40 transition-colors"
                          title="Edit Hajat"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Hapus hajat ini?')) {
                              deleteHajat(hajat.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-500 rounded-xl hover:bg-stone-50 dark:hover:bg-emerald-900/40 transition-colors"
                          title="Hapus Hajat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Specific Prayer */}
                    <div className="mt-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-900/20 border border-stone-200/60 dark:border-emerald-800/40">
                      <div className="text-[11px] font-semibold text-emerald-800 dark:text-amber-300 uppercase tracking-wider mb-1">
                        Lafadz Doa / Afirmasi:
                      </div>
                      <p className="text-xs italic text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
                        “{hajat.specificDua}”
                      </p>
                    </div>

                    {/* Status Switcher */}
                    <div className="mt-4 pt-3 border-t border-stone-100 dark:border-emerald-900/60 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs text-stone-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Dibuat: {new Date(hajat.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-stone-500">Status:</span>
                        <select
                          value={hajat.status}
                          onChange={(e) => handleStatusChange(hajat.id, e.target.value as HajatStatus)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none ${
                            hajat.status === 'terkabul'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200'
                              : hajat.status === 'berikhtiar'
                              ? 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300'
                              : hajat.status === 'menunggu'
                              ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300'
                          }`}
                        >
                          <option value="berikhtiar">Sedang Berikhtiar</option>
                          <option value="menunggu">Menunggu Waktu Terbaik</option>
                          <option value="terkabul">✨ Terkabul (Alhamdulillah!)</option>
                          <option value="hikmah">Diganti yang Lebih Baik (Hikmah)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SEDEKAH SUBUH */}
      {activeSubTab === 'sedekah' && (
        <div className="space-y-4">
          {/* Summary Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
                Total Akumulasi Sedekah
              </span>
              <HandCoins className="w-5 h-5 text-amber-300" />
            </div>
            <div className="text-2xl sm:text-3xl font-black">
              Rp {totalSedekahAmount.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Malaikat fajar berdoa: <em className="italic">“Ya Allah, berikanlah ganti bagi orang yang berinfak.”</em> (HR. Bukhari)
            </p>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-serif text-stone-900 dark:text-stone-100">
              Histori Sedekah Subuh
            </h2>

            <button
              onClick={() => {
                setEditingSedekahItem(null);
                setIsSedekahModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Sedekah Hari Ini</span>
            </button>
          </div>

          <div className="space-y-3">
            {sedekahLogs.length === 0 ? (
              <div className="text-center py-10 px-4 bg-white dark:bg-emerald-950/20 rounded-3xl border border-dashed border-stone-300 dark:border-emerald-800 text-stone-500">
                Belum ada catatan sedekah subuh. Sisihkan walau Rp 2.000 setiap pagi.
              </div>
            ) : (
              sedekahLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-3xl bg-white dark:bg-emerald-950/30 border border-stone-200/80 dark:border-emerald-800/60 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-xl">
                        <Heart className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                          {log.recipientOrPlace}
                        </div>
                        <div className="text-[11px] text-stone-400">
                          {log.date}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {log.amount && (
                        <span className="text-sm font-black text-emerald-700 dark:text-amber-300">
                          Rp {log.amount.toLocaleString('id-ID')}
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setEditingSedekahItem(log);
                          setIsSedekahModalOpen(true);
                        }}
                        className="text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-1 rounded-lg hover:bg-stone-50 dark:hover:bg-emerald-900/40"
                        title="Edit Sedekah"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Hapus catatan sedekah ini?')) {
                            deleteSedekah(log.id);
                          }
                        }}
                        className="text-stone-400 hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-stone-50 dark:hover:bg-emerald-900/40"
                        title="Hapus Sedekah"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {log.prayerWish && (
                    <div className="text-xs text-stone-600 dark:text-stone-300 italic bg-stone-50 dark:bg-emerald-900/20 p-2.5 rounded-xl border border-stone-100 dark:border-emerald-900/40">
                      “{log.prayerWish}”
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddHajatModal
        isOpen={isHajatModalOpen}
        onClose={() => {
          setIsHajatModalOpen(false);
          setEditingHajatItem(null);
        }}
        editingItem={editingHajatItem}
      />

      <AddSedekahModal
        isOpen={isSedekahModalOpen}
        onClose={() => {
          setIsSedekahModalOpen(false);
          setEditingSedekahItem(null);
        }}
        editingItem={editingSedekahItem}
      />
    </div>
  );
};

