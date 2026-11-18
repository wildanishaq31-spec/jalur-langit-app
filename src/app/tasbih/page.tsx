'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { TasbihTab } from '@/components/tabs/TasbihTab';

export default function TasbihRoute() {
  return (
    <AppShell>
      <TasbihTab />
    </AppShell>
  );
}
