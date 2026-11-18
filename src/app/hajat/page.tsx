'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { HajatTab } from '@/components/tabs/HajatTab';

export default function HajatRoute() {
  return (
    <AppShell>
      <HajatTab />
    </AppShell>
  );
}
