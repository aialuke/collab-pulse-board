
import React from 'react';
import { Logo } from '@/components/common/layout/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#E8F0FE]">
      <header className="py-6 px-4">
        <div className="container mx-auto">
          <Logo />
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
      
      <footer className="py-4 px-4 text-center text-sm text-neutral-500">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
