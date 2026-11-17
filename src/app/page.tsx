'use client';

import React, { useState } from 'react';
import { Navigation, ActiveTab } from '@/components/Navigation';
import { HomeTab } from '@/components/tabs/HomeTab';
import { AmalanTab } from '@/components/tabs/AmalanTab';
import { TasbihTab } from '@/components/tabs/TasbihTab';
import { GlowUpTab } from '@/components/tabs/GlowUpTab';
import { VisionBoardTab } from '@/components/tabs/VisionBoardTab';
import { HajatTab } from '@/components/tabs/HajatTab';
import { QuranJournalTab } from '@/components/tabs/QuranJournalTab';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';

export default function Page() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const appTheme = useJalurLangitStore((s) => s.appTheme);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        appTheme === 'blush'
          ? 'bg-[#fffaf9] dark:bg-[#150e12] text-[#2d1b22] dark:text-[#f8eff2]'
          : 'bg-[#fbf9f5] dark:bg-[#0d1713] text-[#1c2e26] dark:text-[#f0f7f3]'
      }`}
    >
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5">
        {activeTab === 'home' && (
          <HomeTab onNavigateToTab={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'amalan' && <AmalanTab />}
        {activeTab === 'glowup' && <GlowUpTab />}
        {activeTab === 'tasbih' && <TasbihTab />}
        {activeTab === 'vision' && <VisionBoardTab />}
        {activeTab === 'hajat' && <HajatTab />}
        {activeTab === 'quran' && <QuranJournalTab />}
      </main>
    </div>
  );
}
