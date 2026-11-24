'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { PwaNotificationManager } from '@/components/pwa/PwaNotificationManager';
import { useAuthStore } from '@/store/useAuthStore';

const APP_ROUTES = [
  '/dashboard',
  '/amalan',
  '/glowup',
  '/tasbih',
  '/vision',
  '/hajat',
  '/quran',
];

export const PersistentNavigationBridge: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated, isTransitioning } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAppRoute = APP_ROUTES.includes(pathname);

  if (!mounted || !isAppRoute || !isAuthenticated || isTransitioning) {
    return null;
  }

  return (
    <>
      <PwaNotificationManager />
      <Navigation />
    </>
  );
};
