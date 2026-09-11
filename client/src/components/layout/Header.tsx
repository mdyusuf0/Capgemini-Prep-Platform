import React from 'react';
import { Search, Flame, Bell, User, LogOut } from 'lucide-react';
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
    if (path.startsWith('/coding')) return 'Coding Practice';
    if (path.startsWith('/mocks')) return 'Mock Tests';
    const parts = path.split('/').filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1) : 'Home';
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-surface border-b border-white/5 shrink-0">
      <div className="flex items-center gap-3">
        <div className="text-lg font-semibold text-white/90">
          {getPageTitle()}
        </div>
        <span className="hidden sm:inline-flex px-2.5 py-0.5 text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
          Capgemini Prep By Yusuf
        </span>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:flex items-center relative group">
          <Search size={18} className="absolute left-3 text-white/40 group-focus-within:text-primary-400 transition-colors" />
          <input
            type="text"
            placeholder="Search problems, topics..."
            className="w-64 bg-background-lighter border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-white/30"
          />
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-warning/10 border border-warning/20 rounded-full">
          <Flame size={16} className="text-warning" />
          <span className="text-sm font-semibold text-warning">7 Day Streak!</span>
        </div>

        <button className="relative p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full border border-surface"></span>
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium text-white">{user?.name || 'Yusuf'}</div>
            <div className="text-xs text-indigo-400/80 font-medium">Administrator</div>
          </div>
          <div className="relative group cursor-pointer" title="Profile">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-200"></div>
            <img
              src="/logo.jpg"
              alt="Yusuf Profile"
              className="relative w-9 h-9 rounded-full object-cover object-top border border-indigo-400/80 shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-surface rounded-full"></span>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 text-white/50 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors cursor-pointer"
          >
            <LogOut size={19} />
          </button>
        </div>
      </div>
    </header>
  );
};
