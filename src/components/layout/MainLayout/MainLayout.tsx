import React, { useRef, useEffect } from 'react';
import { SafeAreaWrapper } from '../SafeAreaWrapper';
import { Header } from '../Header';
import { BottomNavigation } from '../BottomNavigation';

export interface MainLayoutProps {
  children: React.ReactNode;
  userName?: string;
  activeNavItem: string;
  onNavigate: (path: string) => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  showHeader?: boolean;
  showNavigation?: boolean;
  className?: string;
  /** Key to identify the current page for scroll position preservation */
  pageKey?: string;
}

// Store scroll positions for different pages
const scrollPositions = new Map<string, number>();

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  userName,
  activeNavItem,
  onNavigate,
  onSettingsClick,
  onProfileClick,
  showHeader = true,
  showNavigation = true,
  className = '',
  pageKey,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Restore scroll position when page key changes
  useEffect(() => {
    if (pageKey && contentRef.current) {
      const savedPosition = scrollPositions.get(pageKey);
      if (savedPosition !== undefined) {
        contentRef.current.scrollTop = savedPosition;
      } else {
        contentRef.current.scrollTop = 0;
      }
    }
  }, [pageKey]);

  // Save scroll position on scroll
  const handleScroll = () => {
    if (pageKey && contentRef.current) {
      scrollPositions.set(pageKey, contentRef.current.scrollTop);
    }
  };

  return (
    <SafeAreaWrapper
      className="flex flex-col h-screen bg-bg-secondary"
      bottom={false} // Bottom navigation handles its own safe area
    >
      {/* Header */}
      {showHeader && (
        <Header
          userName={userName}
          onSettingsClick={onSettingsClick}
          onProfileClick={onProfileClick}
        />
      )}

      {/* Main Content Area */}
      <main
        ref={contentRef}
        onScroll={handleScroll}
        className={`
          flex-1 overflow-y-auto
          ${showNavigation ? 'pb-20' : ''}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      {showNavigation && (
        <BottomNavigation
          activeItem={activeNavItem}
          onNavigate={onNavigate}
        />
      )}
    </SafeAreaWrapper>
  );
};

export default MainLayout;
