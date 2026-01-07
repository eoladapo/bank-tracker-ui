import React from 'react';

export interface SafeAreaWrapperProps {
  children: React.ReactNode;
  className?: string;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}

/**
 * SafeAreaWrapper handles safe area insets for notched devices (iPhone X+, etc.)
 * Uses CSS env() variables to add appropriate padding for device notches and home indicators
 */
export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  className = '',
  top = true,
  bottom = true,
  left = true,
  right = true,
}) => {
  const safeAreaClasses = [
    top ? 'safe-area-inset-top' : '',
    bottom ? 'safe-area-inset-bottom' : '',
    left ? 'safe-area-inset-left' : '',
    right ? 'safe-area-inset-right' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={`${safeAreaClasses} ${className}`.trim()}>
      {children}
    </div>
  );
};

export default SafeAreaWrapper;
