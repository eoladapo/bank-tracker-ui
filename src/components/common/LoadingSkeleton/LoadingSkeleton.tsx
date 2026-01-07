import React from 'react';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'card';
export type SkeletonAnimation = 'pulse' | 'shimmer';

export interface LoadingSkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  animation?: SkeletonAnimation;
  className?: string;
}

const getVariantStyles = (variant: SkeletonVariant): string => {
  switch (variant) {
    case 'circular':
      return 'rounded-full';
    case 'text':
      return 'rounded h-4';
    case 'card':
      return 'rounded-lg';
    case 'rectangular':
    default:
      return 'rounded';
  }
};

const getAnimationStyles = (animation: SkeletonAnimation): string => {
  switch (animation) {
    case 'shimmer':
      return 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]';
    case 'pulse':
    default:
      return 'animate-pulse bg-gray-200';
  }
};

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
  className = '',
}) => {
  const variantStyles = getVariantStyles(variant);
  const animationStyles = getAnimationStyles(animation);

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  // Set default dimensions based on variant
  if (!width) {
    if (variant === 'circular') {
      style.width = '40px';
    } else if (variant === 'text') {
      style.width = '100%';
    } else if (variant === 'card') {
      style.width = '100%';
    } else {
      style.width = '100%';
    }
  }

  if (!height) {
    if (variant === 'circular') {
      style.height = style.width;
    } else if (variant === 'text') {
      style.height = '1rem';
    } else if (variant === 'card') {
      style.height = '120px';
    } else {
      style.height = '20px';
    }
  }

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading"
      className={`${variantStyles} ${animationStyles} ${className}`}
      style={style}
    />
  );
};

export default LoadingSkeleton;
