
import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';

// Memoize the AppLayout component to prevent unnecessary re-renders
const AppLayout = memo(function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
});

export default AppLayout;
