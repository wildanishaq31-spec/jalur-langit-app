'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Compass, 
  Sparkles, 
  Heart, 
  Send, 
  Check, 
  FileText, 
  Calculator, 
  Headphones, 
  Mail, 
  Moon, 
  Sun,
  Clock
} from 'lucide-react';
import { ROADMAP_FEATURES } from '@/data/roadmapData';
import { RoadmapFeatureItem } from '@/types';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';

export default function RoadmapPage() {
  const { 
    roadmapFeatures,
    featureVotes, 
    userVotedFeatures, 
    voteFeature, 
    addFeatureRequest,
    appTheme,
    toggleTheme 
  } = useJalurLangitStore();

  const activeFeatures = roadmapFeatures && roadmapFeatures.length > 0 ? roadmapFeatures : ROADMAP_FEATURES;

  const [newIdeaText, setNewIdeaText] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleSubmitIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaText.trim()) return;

    addFeatureRequest(newIdeaText.trim());
    setNewIdeaText('');
    setSubmissionSuccess(true);
    setTimeout(() => {
      setSubmissionSuccess(false);
    }, 4000);
  };

  const renderFeatureIcon = (iconName: RoadmapFeatureItem['iconName']) => {
    const iconClass = "w-5 h-5";
    switch (iconName) {
      case 'Compass':
        return <Compass className={iconClass} />;
      case 'FileText':
        return <FileText className={iconClass} />;
      case 'Calculator':
        return <Calculator className={iconClass} />;
      case 'Headphones':
        return <Headphones className={iconClass} />;
      case 'Mail':
        return <Mail className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#0a1410] text-[#1c2e26] dark:text-[#f0f7f3] transition-colors p-4 sm:p-6 pb-24">
      
      {/* Top Header Navigation */}
      <header className="max-w-4xl mx-auto flex items-center justify-between py-2 border-b border-stone-200 dark:border-emerald-900/60 mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-emerald-950/80 border border-stone-200 dark:border-emerald-800 text-stone-700 dark:text-stone-200 text-xs font-bold hover:bg-stone-50 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-stone-100 dark:bg-emerald-950/80 border border-stone-200 dark:border-emerald-800 text-stone-600 dark:text-amber-300 shadow-xs"
            title="Ganti Tema"
          >
            {appTheme === 'dark' ? <Moon className="w-4 h-4 fill-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80 text-xs font-black uppercase tracking-wider">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>Jalur Langit Lab • Coming Soon</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight text-stone-900 dark:text-stone-100">
            Roadmap Inovasi & Fitur Baru
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl mx-auto leading-relaxed">
            Sebagai pembeli resmi lisensi Jalur Langit, Anda berhak menentukan fitur apa yang harus kami rilis lebih cepat. Berikan <b>Vote ❤️</b> pada fitur impian Anda!
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {activeFeatures.map((feature) => {
            const hasVoted = userVotedFeatures.includes(feature.id);
            const currentVotes = (featureVotes[feature.id] || 0) + (feature.category === 'ibadah' ? 142 : 88);

            return (
              <div 
                key={feature.id}
                className="p-5 rounded-3xl bg-white dark:bg-emerald-950/40 border border-stone-200/90 dark:border-emerald-800/70 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div className="space-y-3">
                  {/* Card Header: Icon, Category Badge & Target Date */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-700 text-amber-300 flex items-center justify-center shadow-md shrink-0">
                      {renderFeatureIcon(feature.iconName)}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${feature.badgeColor}`}>
                        {feature.statusLabel}
                      </span>
                      <span className="text-[10px] text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Target: {feature.estimatedRelease}
                      </span>
                    </div>
                  </div>

                  {/* Feature Title & Description */}
                  <div>
                    <h3 className="font-bold text-base font-serif text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Highlights Checklist */}
                  <div className="pt-1">
                    <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                      Keunggulan Fitur:
                    </div>
                    <ul className="grid grid-cols-1 gap-1">
                      {feature.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-xs text-stone-700 dark:text-stone-300 flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Progress Bar & Vote Action */}
                <div className="pt-3 border-t border-stone-100 dark:border-emerald-900/60 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500 font-medium">Progres Pengerjaan</span>
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                      {feature.progressPercent}%
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-emerald-900/40 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-amber-400 transition-all duration-500"
                      style={{ width: `${feature.progressPercent}%` }}
                    />
                  </div>

                  {/* Vote Button */}
                  <button
                    onClick={() => voteFeature(feature.id)}
                    className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${
                      hasVoted
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        : 'bg-stone-50 dark:bg-emerald-900/40 hover:bg-emerald-50 dark:hover:bg-emerald-800/60 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-emerald-800'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${hasVoted ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
                    <span>{hasVoted ? 'Kamu Telah Mendukung' : 'Dukung Fitur Ini (+1 Vote)'}</span>
                    <span className="ml-auto text-[11px] font-black opacity-80">
                      {currentVotes} Suara
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Suggest Feature Form */}
        <div className="p-6 rounded-3xl bg-white dark:bg-emerald-950/40 border border-stone-200/90 dark:border-emerald-800/70 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-base sm:text-lg font-bold font-serif text-stone-900 dark:text-stone-100">
              Punya Usulan Fitur Baru?
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            Tulis ide atau amalan yang ingin kamu jadikan fitur di versi update Jalur Langit selanjutnya:
          </p>

          <form onSubmit={handleSubmitIdea} className="space-y-3">
            <textarea
              required
              rows={3}
              value={newIdeaText}
              onChange={(e) => setNewIdeaText(e.target.value)}
              placeholder="Contoh: Tambahkan dzikir pagi & petang bersuara, atau tracker hafalan surat-surat pendek..."
              className="w-full p-3.5 rounded-2xl bg-stone-50 dark:bg-emerald-950/80 border border-stone-200 dark:border-emerald-800 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-stone-400"
            />

            <div className="flex items-center justify-between">
              {submissionSuccess ? (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Alhamdulillah! Usulanmu telah dicatat di backlog pengembang.
                </span>
              ) : (
                <span className="text-[11px] text-stone-400">
                  Ide terbaik akan kami prioritaskan di roadmap rilis.
                </span>
              )}

              <button
                type="submit"
                disabled={!newIdeaText.trim()}
                className="py-2.5 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs transition-all flex items-center gap-2"
              >
                <span>Kirim Usulan</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

      </main>
    </div>
  );
}
