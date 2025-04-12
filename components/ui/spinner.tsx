/**
 * Spinner Component
 *
 * A reusable loading spinner component with customizable size and color.
 * Uses Tailwind CSS for styling and animations.
 */

import { cn } from '@/lib/utils';

interface SpinnerProps {
  /** Size of the spinner (sm, md, lg) */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
  /** Center the spinner in its container */
  centered?: boolean;
}

/**
 * Spinner component for loading states
 *
 * @example
 * // Small spinner
 * <Spinner size="sm" />
 *
 * @example
 * // Medium spinner (default)
 * <Spinner />
 *
 * @example
 * // Large centered spinner
 * <Spinner size="lg" centered />
 */
export function Spinner({ size = 'md', className, centered = false }: SpinnerProps) {
  // Size mappings with thicker borders for better visibility
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-3',
    lg: 'h-10 w-10 border-4',
  };

  // Base spinner classes with more visible styling
  const spinnerClasses = cn(
    'animate-spin rounded-full border-blue-500 dark:border-blue-400 border-t-transparent shadow-sm',
    sizeClasses[size],
    className
  );

  // If centered, wrap in a centering container
  if (centered) {
    return (
      <div className="flex items-center justify-center">
        <div className={spinnerClasses}></div>
      </div>
    );
  }

  // Otherwise, just return the spinner
  return <div className={spinnerClasses}></div>;
}
