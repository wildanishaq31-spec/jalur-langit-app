'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { VisionBoardTab } from '@/components/tabs/VisionBoardTab';

export default function VisionRoute() {
  return (
    <AppShell>
      <VisionBoardTab />
    </AppShell>
  );
}
