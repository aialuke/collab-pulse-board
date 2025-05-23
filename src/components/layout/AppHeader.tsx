
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Logo } from '@/components/common/layout/Logo';
import { RefreshButton } from '@/components/common/layout/RefreshButton';
import { NotificationsMenu } from '@/components/common/layout/NotificationsMenu';
import { UserMenu } from '@/components/common/layout/UserMenu';

export function AppHeader() {
  const isMobile = useIsMobile();

  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-10 backdrop-blur-sm">
      <div className="h-16 flex items-center justify-between w-full max-w-6xl mx-auto px-3 sm:px-4">
        <Logo />

        <div className="flex items-center space-x-2 sm:space-x-4">
          {isMobile && <RefreshButton />}
          <NotificationsMenu />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
