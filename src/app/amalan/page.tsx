'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { AmalanTab } from '@/components/tabs/AmalanTab';

export default function AmalanRoute() {
  return (
    <AppShell>
      <AmalanTab />
    </AppShell>
  );
}
