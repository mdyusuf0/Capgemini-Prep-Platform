import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, CheckCircle2, AlertCircle, Info, Sparkles, 
  Trash2, ExternalLink, X, CheckCheck
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'system' | 'streak' | 'assessment' | 'achievement';
  read: boolean;
  actionUrl?: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Capgemini Drive 2026/27 Pattern Active',
    description: 'Assessment syllabus loaded: Technical MCQ, Pseudocode Output Tracing, Coding Lab, and Sandboxed Debugging.',
    timestamp: '10m ago',
    type: 'assessment',
    read: false,
    actionUrl: '/roadmap',
  },
  {
    id: 'notif-2',
    title: '12-Day Preparation Streak Active 🔥',
    description: 'You are on an active 12-day practice streak! Complete today’s coding challenge to maintain your streak.',
    timestamp: '1h ago',
    type: 'streak',
    read: false,
    actionUrl: '/daily-challenge',
  },
  {
    id: 'notif-3',
    title: 'Real Compiler Sandbox Online ⚡',
    description: 'C++, Java, and Python compilers are active. Run & test code before submitting to view exact compiler diagnostic errors.',
    timestamp: '3h ago',
    type: 'system',
    read: false,
    actionUrl: '/coding',
  },
  {
    id: 'notif-4',
    title: 'Candidate Profile & Details Ready',
    description: 'You can now update your display name, college, graduation year, and target Capgemini package in your Profile.',
    timestamp: '5h ago',
    type: 'achievement',
    read: true,
    actionUrl: '/profile',
  },
  {
    id: 'notif-5',
    title: '50 Authentic Coding Problems Added',
    description: 'Two Sum, Kadane’s algorithm, Valid Anagram, and more are now verified with runnable starter code in the Coding Roster.',
    timestamp: '1d ago',
    type: 'system',
    read: true,
    actionUrl: '/coding',
  }
];

export const NotificationCenter: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('capgemini_notifications');
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
  });
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('capgemini_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    markAsRead(notif.id);
    if (notif.actionUrl) {
      navigate(notif.actionUrl);
      setIsOpen(false);
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'streak': return <Sparkles className="w-4 h-4 text-accent-pink" />;
      case 'assessment': return <AlertCircle className="w-4 h-4 text-secondary" />;
      case 'achievement': return <CheckCircle2 className="w-4 h-4 text-accent-mint" />;
      default: return <Info className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-surface-cream text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer border border-transparent hover:border-border-hairline"
        title="Notifications & Updates"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-accent-pink text-white text-[10px] font-mono font-bold flex items-center justify-center ring-2 ring-surface-paper animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-paper border border-border-hairline rounded-2xl shadow-xl z-50 overflow-hidden font-sans animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-border-hairline flex items-center justify-between bg-surface-cream/50">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-on-surface">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-accent-pink/15 text-accent-pink border border-accent-pink/20">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] font-semibold text-secondary hover:underline cursor-pointer flex items-center gap-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark Read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-md hover:bg-surface-cream cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 border-b border-border-hairline flex gap-2 bg-surface-paper">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-primary-container text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface bg-surface-cream'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'unread'
                  ? 'bg-primary-container text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface bg-surface-cream'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-border-hairline">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-accent-mint mx-auto" />
                <p className="text-xs font-bold text-on-surface">You are all caught up!</p>
                <p className="text-[11px] text-on-surface-variant">No notifications match your current filter.</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 sm:p-4 hover:bg-surface-cream/80 transition-colors cursor-pointer flex items-start gap-3 relative group ${
                    !notif.read ? 'bg-secondary/5' : ''
                  }`}
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-surface-cream border border-border-hairline shrink-0">
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-bold text-on-surface truncate ${!notif.read ? 'text-primary' : ''}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] font-mono text-zinc-600 font-bold shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-700 font-medium leading-relaxed line-clamp-2">
                      {notif.description}
                    </p>

                    {notif.actionUrl && (
                      <div className="pt-1 flex items-center text-[10px] font-mono font-bold text-secondary gap-1 group-hover:underline">
                        <span>Take Action</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Individual Delete Button on hover */}
                  <button
                    onClick={(e) => clearNotification(notif.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-on-surface-variant hover:text-red-600 transition-opacity rounded cursor-pointer"
                    title="Dismiss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {!notif.read && (
                    <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-secondary" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border-hairline bg-surface-cream/50 text-center">
            <span className="text-[11px] font-mono font-semibold text-on-surface-variant">
              Capgemini Prep By Yusuf • Notification Engine
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
