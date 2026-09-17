import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Map as MapIcon,
  HelpCircle,
  Code2,
  Terminal,
  Bug,
  Bot,
  BrainCircuit,
  MessageSquare,
  Gamepad2,
  Users,
  Timer,
  FileText,
  Target,
  Flame,
  Zap,
  Mic,
  PieChart,
  XCircle,
  Bookmark,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ListOrdered,
  Sparkles,
  UserCheck,
  History,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuthStore();
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

  const navGroups = [
    {
      title: 'Core',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Zap, label: 'Daily Mission', path: '/daily-challenge' },
        { icon: ListOrdered, label: 'Must-Know 100', path: '/must-know' },
      ],
    },
    {
      title: 'Practice Hub',
      items: [
        { icon: HelpCircle, label: 'Technical MCQ', path: '/practice/mcq' },
        { icon: Code2, label: 'Pseudocode Tracing', path: '/practice/pseudocode' },
        { icon: Terminal, label: 'Coding Lab', path: '/coding' },
        { icon: Bug, label: 'Debugging Hub', path: '/debugging' },
      ],
    },
    {
      title: 'PYQ Revision Section',
      items: [
        { icon: History, label: 'PYQ Revision', path: '/pyq-revision', badge: '2017–23' },
      ],
    },
    {
      title: 'Cognitive & Values',
      items: [
        { icon: Gamepad2, label: 'Cognitive Mini-Games', path: '/games' },
        { icon: Users, label: 'Behavioral SJT', path: '/behavioral' },
        { icon: BrainCircuit, label: 'AI Literacy', path: '/ai-literacy' },
        { icon: MessageSquare, label: 'Communication', path: '/communication' },
      ],
    },
    {
      title: 'Assessments',
      items: [
        { icon: FileText, label: 'Mock Simulator', path: '/mocks' },
        { icon: Timer, label: 'Timed Debugging', path: '/debugging/timed' },
      ],
    },
    {
      title: 'Interviews & Growth',
      items: [
        { icon: Mic, label: 'AI Interviewer', path: '/interview/ai' },
        { icon: Terminal, label: 'Technical Interview', path: '/interview/technical' },
        { icon: Users, label: 'HR Interview', path: '/interview/hr' },
        { icon: PieChart, label: 'Analytics', path: '/analytics' },
        { icon: MapIcon, label: 'Roadmap', path: '/roadmap' },
        { icon: XCircle, label: 'Mistakes Notebook', path: '/mistakes' },
        { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
      ],
    },
  ];

  const renderNavContent = (isMobile: boolean = false) => (
    <>
      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            {(isOpen || isMobile) && (
              <h3 className="px-3 pb-1 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                {group.title}
              </h3>
            )}
            <div className="space-y-0.5">
              {group.items.map((item, itemIdx) => (
                <NavLink
                  key={itemIdx}
                  to={item.path}
                  onClick={() => {
                    if (isMobile) toggleSidebar();
                  }}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors group relative min-h-[40px]',
                      isActive
                        ? 'bg-primary-container text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    )
                  }
                  title={(!isOpen && !isMobile) ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        size={18}
                        className={cn(
                          'shrink-0 transition-colors',
                          isActive ? 'text-on-primary' : 'text-on-surface-variant group-hover:text-on-surface'
                        )}
                      />
                      {(isOpen || isMobile) && <span className="truncate">{item.label}</span>}
                      {(isOpen || isMobile) && (item as any).badge && (
                        <span className={cn(
                          "ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold tracking-tight shrink-0",
                          isActive
                            ? "bg-on-primary/20 text-on-primary"
                            : "bg-secondary/10 text-secondary"
                        )}>
                          {(item as any).badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Information & Action Footer */}
      <div className="p-3 border-t border-border-hairline shrink-0 space-y-2 bg-surface-cream pb-safe">
        {(isOpen || isMobile) && (
          <div className="bg-surface-container-high rounded-lg p-2.5 flex items-center justify-between border border-border-hairline">
            <div className="flex flex-col">
              <span className="text-[9px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Target Batch
              </span>
              <span className="text-xs text-on-surface font-semibold">
                Drive 2026/27
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-surface-paper text-secondary font-semibold border border-border-hairline shadow-xs">
              READY
            </span>
          </div>
        )}

        {(isOpen || isMobile) && (
          <NavLink
            to="/profile"
            onClick={() => {
              if (isMobile) toggleSidebar();
            }}
            className="px-2.5 py-1.5 rounded-lg bg-surface-paper border border-border-hairline flex items-center gap-2.5 hover:border-secondary/40 transition-colors group cursor-pointer"
            title="Manage Your Profile"
          >
            <img
              src="/logo.jpg"
              alt="Avatar"
              className="w-7 h-7 rounded-full object-cover object-top ring-1 ring-border-hairline shrink-0 group-hover:ring-secondary"
            />
            <div className="min-w-0">
              <div className="text-[9px] text-secondary font-semibold uppercase group-hover:underline">View Profile →</div>
              <div className="text-xs font-bold text-on-surface truncate">{useAuthStore.getState().user?.displayName || useAuthStore.getState().user?.name || 'Yusuf Khan'}</div>
            </div>
          </NavLink>
        )}

        <div className="space-y-0.5 pt-1">
          <NavLink
            to="/profile"
            onClick={() => {
              if (isMobile) toggleSidebar();
            }}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors min-h-[40px]',
                isActive
                  ? 'bg-surface-container-high text-on-surface font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              )
            }
          >
            <UserCheck size={18} className="shrink-0 text-secondary" />
            {(isOpen || isMobile) && <span>My Profile</span>}
          </NavLink>

          <NavLink
            to="/settings"
            onClick={() => {
              if (isMobile) toggleSidebar();
            }}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors min-h-[40px]',
                isActive
                  ? 'bg-surface-container-high text-on-surface font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              )
            }
          >
            <Settings size={18} className="shrink-0 text-on-surface-variant" />
            {(isOpen || isMobile) && <span>Settings</span>}
          </NavLink>

          <button
            onClick={() => {
              if (isMobile) toggleSidebar();
              handleLogout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-error hover:bg-error-container hover:text-on-error-container rounded-lg transition-colors cursor-pointer text-left min-h-[40px]"
            title="Log Out"
          >
            <LogOut size={18} className="shrink-0 text-error" />
            {(isOpen || isMobile) && <span>Log Out</span>}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* 1. Desktop Sidebar (Hidden on mobile) */}
      <motion.aside
        initial={{ width: isOpen ? 272 : 80 }}
        animate={{ width: isOpen ? 272 : 80 }}
        className="hidden lg:flex flex-col h-full bg-surface-cream border-r border-border-hairline relative flex-shrink-0 transition-all select-none"
      >
        {/* Brand Header */}
        <div className="min-h-[4.5rem] py-3 flex items-center justify-between px-4 border-b border-border-hairline shrink-0 bg-surface-cream">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="shrink-0 w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="32" height="32" fill="none">
                <rect width="48" height="48" rx="10" fill="#141414" />
                <path d="M14 24L21 17L23.8 19.8L19.6 24L23.8 28.2L21 31L14 24Z" fill="#69bee2" />
                <path d="M34 24L27 17L24.2 19.8L28.4 24L24.2 28.2L27 31L34 24Z" fill="#fc618d" />
                <circle cx="24" cy="24" r="2.5" fill="#7bd88f" />
              </svg>
            </div>

            {isOpen && (
              <div className="flex flex-col min-w-0">
                <span className="font-black text-base text-on-surface tracking-tight leading-tight truncate font-sans">
                  Capgemini Prep
                </span>
                <span className="text-sm font-extrabold text-secondary leading-snug mt-0.5 truncate">
                  A platform by Yusuf
                </span>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-6 bg-surface-paper border border-border-hairline rounded-full p-1 text-on-surface-variant hover:text-on-surface shadow-sm cursor-pointer z-10 transition-colors"
            title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>

        {renderNavContent(false)}
      </motion.aside>

      {/* 2. Mobile Off-Canvas Drawer with Backdrop (Visible on mobile when open) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Slide-in Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative w-[285px] max-w-[85vw] bg-surface-cream border-r border-border-hairline shadow-2xl flex flex-col h-full z-10 select-none"
            >
              {/* Mobile Drawer Header */}
              <div className="min-h-[4.5rem] py-3 flex items-center justify-between px-4 border-b border-border-hairline shrink-0 bg-surface-cream pt-safe">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="shrink-0 w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="32" height="32" fill="none">
                      <rect width="48" height="48" rx="10" fill="#141414" />
                      <path d="M14 24L21 17L23.8 19.8L19.6 24L23.8 28.2L21 31L14 24Z" fill="#69bee2" />
                      <path d="M34 24L27 17L24.2 19.8L28.4 24L24.2 28.2L27 31L34 24Z" fill="#fc618d" />
                      <circle cx="24" cy="24" r="2.5" fill="#7bd88f" />
                    </svg>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-black text-base text-on-surface tracking-tight leading-tight truncate font-sans">
                      Capgemini Prep
                    </span>
                    <span className="text-xs font-bold text-secondary leading-snug mt-0.5 truncate">
                      A platform by Yusuf
                    </span>
                  </div>
                </div>

                <button
                  onClick={toggleSidebar}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-paper border border-border-hairline text-on-surface-variant hover:text-on-surface active:scale-95 shadow-xs cursor-pointer"
                  title="Close Navigation Drawer"
                  aria-label="Close Navigation Drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {renderNavContent(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
