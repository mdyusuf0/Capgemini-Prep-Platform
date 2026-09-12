import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, HelpCircle, Gamepad2, FileText, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  // Hide on full-screen test taking
  if (location.pathname.startsWith('/mocks/attempt')) {
    return null;
  }

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/practice', label: 'Practice', icon: HelpCircle },
    { to: '/games', label: 'Games', icon: Gamepad2 },
    { to: '/mocks', label: 'Mocks', icon: FileText },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-paper/95 backdrop-blur-md border-t border-border-hairline shadow-[0_-2px_10px_rgba(0,0,0,0.04)] pb-safe"
    >
      <div className="flex items-center justify-around h-16 px-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || 
            (item.to !== '/dashboard' && location.pathname.startsWith(item.to));

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full min-w-[56px] py-1 transition-all select-none cursor-pointer group',
                isActive 
                  ? 'text-on-surface' 
                  : 'text-on-surface-variant/70 hover:text-on-surface'
              )}
            >
              <div 
                className={cn(
                  'w-10 h-7 rounded-full flex items-center justify-center transition-all duration-200',
                  isActive 
                    ? 'bg-primary-container text-white scale-105 shadow-xs' 
                    : 'group-active:scale-95'
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span 
                className={cn(
                  'text-[10px] tracking-tight mt-0.5 font-medium transition-colors leading-none',
                  isActive ? 'font-bold text-on-surface' : 'text-on-surface-variant'
                )}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
