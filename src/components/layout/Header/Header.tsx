import React from 'react';

export interface HeaderProps {
  userName?: string;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  className?: string;
}

/**
 * Gets a time-based greeting message
 */
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const Header: React.FC<HeaderProps> = ({
  userName,
  onSettingsClick,
  onProfileClick,
  className = '',
}) => {
  const greeting = getGreeting();
  const displayName = userName || 'there';

  return (
    <header
      className={`
        flex items-center justify-between
        px-4 py-3
        bg-white border-b border-gray-100
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{greeting},</span>
        <span className="text-lg font-semibold text-gray-900">{displayName}</span>
      </div>

      <div className="flex items-center gap-2">
        {onProfileClick && (
          <button
            onClick={onProfileClick}
            className="
              flex items-center justify-center
              w-10 h-10 rounded-full
              bg-gray-100 hover:bg-gray-200
              transition-colors duration-200
              min-touch
            "
            aria-label="Profile"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
        )}

        {onSettingsClick && (
          <button
            onClick={onSettingsClick}
            className="
              flex items-center justify-center
              w-10 h-10 rounded-full
              bg-gray-100 hover:bg-gray-200
              transition-colors duration-200
              min-touch
            "
            aria-label="Settings"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
