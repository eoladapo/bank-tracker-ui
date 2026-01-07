import React from 'react';
import { motion } from 'framer-motion';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

export interface BottomNavigationProps {
  items?: NavItem[];
  activeItem: string;
  onNavigate: (path: string) => void;
}

// Default navigation items for SpendWise
const defaultNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'accounts',
    label: 'Accounts',
    path: '/accounts',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    id: 'transactions',
    label: 'Transactions',
    path: '/transactions',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    id: 'insights',
    label: 'Insights',
    path: '/insights',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'ai',
    label: 'AI',
    path: '/ai',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];


export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items = defaultNavItems,
  activeItem,
  onNavigate,
}) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = activeItem === item.id || activeItem === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.path)}
              className={`
                relative flex flex-col items-center justify-center
                min-touch px-3 py-2
                transition-colors duration-200
                ${isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}
              `.trim().replace(/\s+/g, ' ')}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-500 rounded-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              
              {/* Icon */}
              <span className="relative">
                {item.icon}
              </span>
              
              {/* Label */}
              <span className={`
                text-xs mt-1 font-medium
                ${isActive ? 'text-primary-600' : 'text-gray-500'}
              `.trim().replace(/\s+/g, ' ')}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
