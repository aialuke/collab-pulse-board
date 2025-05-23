
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Logo } from './Logo';
import { RefreshButton } from './RefreshButton';
import { NotificationsMenu } from './NotificationsMenu';
import { UserMenu } from './UserMenu';

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
