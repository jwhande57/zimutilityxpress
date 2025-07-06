
import React from 'react';

/**
 * LoadingButton Props Interface
 * Defines the properties accepted by the LoadingButton component
 */
interface LoadingButtonProps {
  isLoading: boolean;           // Controls loading state and spinner visibility
  children: React.ReactNode;    // Button text/content when not loading
  className?: string;           // Additional CSS classes for styling
  onClick?: () => void;         // Click handler function
  type?: 'button' | 'submit';   // HTML button type attribute
}

/**
 * LoadingButton Component
 * A reusable button that shows loading spinner and disables interaction during async operations
 * Used throughout payment forms to prevent double-submissions and provide user feedback
 * 
 * @param isLoading - Whether to show loading state
 * @param children - Button content when not loading
 * @param className - Additional CSS classes
 * @param onClick - Click event handler
 * @param type - Button type (default: 'submit')
 */
const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  className = '',
  onClick,
  type = 'submit'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}  // Disable button during loading to prevent multiple clicks
      className={`
        w-full py-3 px-6 rounded-xl text-white font-medium 
        transition-all disabled:opacity-50 disabled:cursor-not-allowed 
        flex items-center justify-center gap-2 
        ${className}
      `}
    >
      {/* Conditional rendering based on loading state */}
      {isLoading ? (
        <>
          {/* CSS-only loading spinner */}
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {/* Loading text */}
          Processing...
        </>
      ) : (
        /* Normal button content when not loading */
        children
      )}
    </button>
  );
};

export default LoadingButton;
