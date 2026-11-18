'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { HomeTab } from '@/components/tabs/HomeTab';
import { ActiveTab } from '@/components/Navigation';

export default function DashboardRoute() {
  const router = useRouter();

  const handleNavigateToTab = (tab: ActiveTab) => {
    const route = tab === 'home' ? '/dashboard' : `/${tab}`;
    router.push(route);
  };

  return (
    <AppShell>
      <HomeTab onNavigateToTab={handleNavigateToTab} />
    </AppShell>
  );
}
