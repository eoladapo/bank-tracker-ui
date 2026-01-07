import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const getVariantStyles = (variant: ButtonVariant): string => {
  switch (variant) {
    case 'primary':
      return 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus:ring-primary-300';
    case 'secondary':
      return 'bg-secondary-500 text-gray-900 hover:bg-secondary-600 active:bg-secondary-700 focus:ring-secondary-300';
    case 'outline':
      return 'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-300';
    case 'ghost':
      return 'bg-transparent text-primary-500 hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-300';
    default:
      return '';
  }
};

const getSizeStyles = (size: ButtonSize): string => {
  switch (size) {
    case 'sm':
      // Minimum 44px touch target on mobile
      return 'min-h-[44px] px-3 py-2 text-sm';
    case 'md':
      return 'min-h-[44px] px-4 py-2.5 text-base';
    case 'lg':
      return 'min-h-[52px] px-6 py-3 text-lg';
    default:
      return '';
  }
};

const Spinner: React.FC<{ size: ButtonSize }> = ({ size }) => {
  const spinnerSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  
  return (
    <svg
      className={`animate-spin ${spinnerSize}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);
  const widthStyles = fullWidth ? 'w-full' : '';
  const disabledStyles = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`
        inline-flex items-center justify-center
        font-medium rounded-lg
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${variantStyles}
        ${sizeStyles}
        ${widthStyles}
        ${disabledStyles}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <span className="mr-2">
          <Spinner size={size} />
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;
