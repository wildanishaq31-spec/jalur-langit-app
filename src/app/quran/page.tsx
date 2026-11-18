'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { QuranJournalTab } from '@/components/tabs/QuranJournalTab';

export default function QuranRoute() {
  return (
    <AppShell>
      <QuranJournalTab />
    </AppShell>
  );
}
