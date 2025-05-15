
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant of the skeleton
   * - default: Standard pulse animation
   * - wave: Wave animation that moves from left to right
   * - shimmer: Diagonal shimmer effect
   */
  variant?: 'default' | 'wave' | 'shimmer';
}

/**
 * Enhanced skeleton component with multiple animation variants
 * for more engaging loading states
 */
function Skeleton({
  className,
  variant = 'default',
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted", 
        variant === 'default' && "animate-pulse",
        variant === 'wave' && "animate-skeleton-wave relative overflow-hidden",
        variant === 'shimmer' && "animate-skeleton-shimmer relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        className
      )}
      {...props}
      aria-hidden="true"
    />
  )
}

export { Skeleton }
