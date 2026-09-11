import React from 'react';
import { Search, Flame, Bell, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLocation, useNavigate } from 'react-router-dom';
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
      {/* Left: Telemetry & Breadcrumb */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-on-surface-variant flex items-center gap-1.5 bg-surface-paper px-2 py-0.5 rounded border border-border-hairline">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse" />
          SYS:ONLINE
        </span>

        <span className="text-border-hairline">/</span>

        <div className="text-sm font-semibold text-on-surface">
          {getPageTitle()}
        </div>

        <span className="hidden lg:inline-flex px-2 py-0.5 text-[10px] font-mono font-semibold bg-surface-container-high text-on-surface rounded border border-border-hairline">
          CapPrep // Engine v2.4
        </span>
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
          <kbd className="absolute right-2 font-mono text-[10px] text-on-surface-variant bg-surface-container-high px-1 py-0.2 rounded border border-border-hairline">⌘K</kbd>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-paper border border-border-hairline shadow-xs">
          <span className="text-accent-pink font-mono text-xs">🔥</span>
          <span className="font-mono text-xs font-semibold text-on-surface">12 Days</span>
        </div>

        {/* Target Drive Tag */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-mono text-xs font-semibold border border-secondary/20">
          [TARGET: Drive 2026/27]
        </div>

        {/* Notifications */}
        <button 
          className="relative p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-pink" />
        </button>

        {/* User Badge & Logout */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border-hairline">
          <div className="hidden md:flex flex-col text-right leading-tight">
            <span className="text-xs font-semibold text-on-surface">{user?.name || 'Yusuf'}</span>
            <span className="font-mono text-[10px] text-on-surface-variant">99.4%ile • Admin</span>
          </div>

          <div className="relative group cursor-pointer" title="Profile">
            <img
              src="/logo.jpg"
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover object-top border border-border-hairline shadow-xs"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-accent-mint border-2 border-surface-paper rounded-full" />
          </div>

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
