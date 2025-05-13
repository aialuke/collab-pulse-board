
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { FloatingFeedbackButton } from '@/components/feedback/FloatingFeedbackButton';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#E8F0FE] flex flex-col">
      <AppHeader />
      <main className="flex-1 w-full px-3 py-4 sm:px-4 sm:py-6 overflow-auto">
        <div className="w-full mx-auto max-w-[600px]">
          <Outlet />
        </div>
      </main>
      <FloatingFeedbackButton />
    </div>
  );
}
