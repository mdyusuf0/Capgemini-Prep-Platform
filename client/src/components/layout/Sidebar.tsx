import React from 'react';
import { NavLink } from 'react-router-dom';
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
  History,
  Flame,
  Zap,
  Mic,
  PieChart,
  XCircle,
  Bookmark,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navGroups = [
    {
      title: 'PRIORITY MODES',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Flame, label: 'Must-Know Questions', path: '/must-know' },
        { icon: Zap, label: 'Daily 50 Sprint', path: '/daily-challenge' },
      ],
    },
    {
      title: 'PREPARATION',
      items: [
        { icon: MapIcon, label: 'Roadmap', path: '/roadmap' },
        { icon: HelpCircle, label: 'Technical MCQ', path: '/practice/mcq' },
        { icon: Code2, label: 'Pseudocode', path: '/practice/pseudocode' },
        { icon: Terminal, label: 'Coding', path: '/coding' },
        { icon: Bug, label: 'Debugging', path: '/debugging' },
        { icon: Bot, label: 'AI Coding', path: '/ai-coding' },
        { icon: BrainCircuit, label: 'AI Literacy', path: '/ai-literacy' },
        { icon: MessageSquare, label: 'Communication', path: '/communication' },
        { icon: Gamepad2, label: 'Cognitive Games', path: '/games' },
        { icon: Users, label: 'Behavioral', path: '/behavioral' },
      ],
    },
    {
      title: 'MOCKS',
      items: [
        { icon: Timer, label: 'Quick Mock', path: '/mocks?type=quick' },
        { icon: Target, label: 'Section Mock', path: '/mocks?type=section' },
        { icon: FileText, label: 'Full Mock', path: '/mocks?type=full' },
        { icon: History, label: 'Previous Attempts', path: '/mocks/history' },
      ],
    },
    {
      title: 'INTERVIEW',
      items: [
        { icon: Terminal, label: 'Technical', path: '/interview/technical' },
        { icon: Users, label: 'HR', path: '/interview/hr' },
        { icon: Mic, label: 'AI Interview', path: '/interview/ai' },
      ],
    },
    {
      title: 'PROGRESS',
      items: [
        { icon: PieChart, label: 'Analytics', path: '/analytics' },
        { icon: XCircle, label: 'Mistakes', path: '/mistakes' },
        { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
      ],
    },
  ];

  return (
    <motion.aside
      initial={{ width: isOpen ? 256 : 80 }}
      animate={{ width: isOpen ? 256 : 80 }}
      className="flex flex-col h-full bg-surface-light border-r border-white/5 relative flex-shrink-0 transition-all"
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/30">
            <span className="font-bold text-white text-base leading-none">Y</span>
          </div>
          {isOpen && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-white tracking-tight leading-tight truncate">
                Capgemini Prep
              </span>
              <span className="text-[10px] font-bold text-indigo-400 leading-tight">
                By Yusuf
              </span>
            </div>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-5 bg-surface-light border border-white/10 rounded-full p-1 text-white/50 hover:text-white"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            {isOpen && (
              <h3 className="px-4 text-xs font-semibold text-white/40 mb-2 uppercase tracking-wider">
                {group.title}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item, itemIdx) => (
                <NavLink
                  key={itemIdx}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-2 text-sm font-medium transition-all group relative',
                      isActive
                        ? 'text-primary-400 bg-primary-500/10'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    )
                  }
                  title={!isOpen ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active-indicator"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"
                        />
                      )}
                      <item.icon
                        size={20}
                        className={cn('shrink-0', isActive ? 'text-primary-400' : 'text-white/40 group-hover:text-white')}
                      />
                      {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="px-4 py-3 mx-3 mb-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
          <div className="text-[10px] text-gray-400 font-medium">Platform Created By</div>
          <div className="text-xs font-bold text-indigo-400 tracking-wide">Yusuf</div>
        </div>
      )}

      <div className="p-4 border-t border-white/5 shrink-0">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-4 py-2 text-sm font-medium transition-all group rounded-md',
              isActive
                ? 'text-primary-400 bg-primary-500/10'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            )
          }
        >
          <Settings size={20} className="shrink-0 text-white/40 group-hover:text-white" />
          {isOpen && <span>Settings</span>}
        </NavLink>
      </div>
    </motion.aside>
  );
};
