'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginPage } from '@/components/auth/LoginPage';
import { LoginTransitionLoader } from '@/components/auth/LoginTransitionLoader';
import { useAuthStore } from '@/store/useAuthStore';
import { useJalurLangitStore } from '@/store/useJalurLangitStore';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isTransitioning, completeTransition } = useAuthStore();
  const { appTheme } = useJalurLangitStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (appTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [appTheme]);

  useEffect(() => {
    if (mounted && isAuthenticated && !isTransitioning) {
      router.replace('/dashboard');
    }
  }, [mounted, isAuthenticated, isTransitioning, router]);

  if (!mounted) {
    return <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#0a1410]" />;
  }

  if (isTransitioning) {
    return (
      <LoginTransitionLoader
        onComplete={() => {
          completeTransition();
          router.replace('/dashboard');
        }}
      />
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf9f5] dark:bg-[#0a1410] text-stone-500 text-xs">
      Membuka Jalur Langit...
    </div>
  );
}
