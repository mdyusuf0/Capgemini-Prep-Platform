import React from 'react';
import { Search, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { NotificationCenter } from './NotificationCenter';
import toast from 'react-hot-toast';

interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      navigate('/login');
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/practice/mcq')) return 'Technical MCQ Practice';
    if (path.startsWith('/practice/pseudocode')) return 'Pseudocode Tracing';
    if (path.startsWith('/coding')) return 'Coding Lab';
    if (path.startsWith('/debugging')) return 'Debugging Hub';
    if (path.startsWith('/mocks')) return 'Mock Simulator';
    if (path.startsWith('/games')) return 'Cognitive Mini-Games';
    if (path.startsWith('/behavioral')) return 'Behavioral SJT';
    if (path.startsWith('/roadmap')) return 'Preparation Roadmap';
    if (path.startsWith('/analytics')) return 'Analytics Ledger';
    if (path.startsWith('/must-know')) return 'Must-Know 100';
    if (path.startsWith('/daily-challenge')) return 'Daily Mission Sprint';
    const parts = path.split('/').filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1) : 'Home';
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6 bg-surface-cream/95 backdrop-blur-md border-b border-border-hairline shrink-0 shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-40">
      {/* Left: Breadcrumb / Title */}
      <div className="flex items-center gap-3">
        <div className="text-sm font-semibold text-on-surface">
          {getPageTitle()}
        </div>
      </div>

      {/* Right: Search, Streaks, Target, Profile */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center relative">
          <Search size={14} className="absolute left-2.5 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Jump to concept, module..."
            className="h-8 w-56 lg:w-64 bg-surface-paper border border-border-hairline rounded-lg pl-8 pr-9 text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-border-graphite shadow-xs transition-all"
          />
          <kbd className="absolute right-2 text-[10px] text-on-surface-variant bg-surface-container-high px-1 py-0.2 rounded border border-border-hairline font-medium">⌘K</kbd>
        </div>


        {/* Target Drive Tag */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold border border-secondary/20">
          [TARGET: Drive 2026/27]
        </div>

        {/* Notifications */}
        <NotificationCenter />

        {/* User Badge & Logout */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border-hairline">
          <button
            onClick={() => navigate('/profile')}
            className="hidden md:flex flex-col text-right leading-tight hover:opacity-80 transition-opacity cursor-pointer text-left"
            title="View & Edit Profile"
          >
            <span className="text-xs font-bold text-on-surface">{user?.displayName || user?.name || 'Yusuf Khan'}</span>
            <span className="text-[10px] text-on-surface-variant font-medium">99.4%ile • {user?.role === 'admin' ? 'Admin' : 'Candidate'}</span>
          </button>

          <button 
            onClick={() => navigate('/profile')}
            className="relative group cursor-pointer focus:outline-none" 
            title="Candidate Profile Settings"
          >
            <img
              src="/logo.jpg"
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover object-top border border-border-hairline shadow-xs group-hover:ring-2 group-hover:ring-primary transition-all"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent-mint border-2 border-surface-paper rounded-full" />
          </button>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-colors cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
