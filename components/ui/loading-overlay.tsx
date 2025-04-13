/**
 * Loading Overlay Component
 *
 * A reusable component that displays a loading overlay with a spinner.
 * Can be used to indicate loading states for buttons, forms, or entire pages.
 */

import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  /** Whether the overlay is visible */
  isLoading: boolean;
  /** Additional CSS classes for the overlay */
  className?: string;
  /** Text to display below the spinner (optional) */
  text?: string;
  /** Whether to make the overlay semi-transparent (default: true) */
  transparent?: boolean;
  /** Whether to show a backdrop blur effect (default: false) */
  blur?: boolean;
  /** Size of the spinner (sm, md, lg) */
  spinnerSize?: 'sm' | 'md' | 'lg';
}

/**
 * Loading overlay component
 *
 * @example
 * // Basic usage
 * <LoadingOverlay isLoading={isLoading} />
 *
 * @example
 * // With custom text
 * <LoadingOverlay isLoading={isLoading} text="Processing..." />
 *
 * @example
 * // With blur effect
 * <LoadingOverlay isLoading={isLoading} blur />
 */
export function LoadingOverlay({
  isLoading,
  className,
  text,
  transparent = true,
  blur = false,
  spinnerSize = 'md'
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-center z-50',
        transparent ? 'bg-background/80' : 'bg-background',
        blur && 'backdrop-blur-sm',
        className
      )}
    >
      <Spinner size={spinnerSize} />
      {text && (
        <p className="mt-2 text-sm font-medium text-foreground">{text}</p>
      )}
    </div>
  );
}

/**
 * Button Loading Overlay Component
 *
 * A specialized loading overlay for buttons.
 */
export function ButtonLoadingOverlay({
  isLoading,
  text = "Loading..."
}: {
  isLoading: boolean;
  text?: string;
}) {
  if (!isLoading) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-primary/90 rounded-md z-50 shadow-md"
      style={{ pointerEvents: 'all' }} // Ensure the overlay captures all clicks
    >
      <div className="flex items-center space-x-2 px-4 py-2">
        <Spinner size="sm" className="text-primary-foreground" />
        <span className="text-sm font-medium text-primary-foreground">{text}</span>
      </div>
    </div>
  );
}
