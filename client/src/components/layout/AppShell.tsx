import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';

export const AppShell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  const location = useLocation();

  // Auto-close mobile drawer on route navigation
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      if (sidebarOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const isImmersiveExam = location.pathname.startsWith('/mocks/attempt');

  return (
    <div className="flex min-h-dvh h-dvh overflow-hidden bg-surface-cream text-on-surface">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className={`flex-1 overflow-y-auto p-3 sm:p-5 md:p-8 bg-surface-cream ${isImmersiveExam ? 'pb-3' : 'pb-24 lg:pb-8'}`}>
          <Outlet />
        </main>
      </div>

      {!isImmersiveExam && <MobileBottomNav />}
    </div>
  );
};
