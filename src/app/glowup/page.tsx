'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { GlowUpTab } from '@/components/tabs/GlowUpTab';

export default function GlowUpRoute() {
  return (
    <AppShell>
      <GlowUpTab />
    </AppShell>
  );
}
