
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-[1px] touch-action-manipulation",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/30",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-destructive/30",
        outline:
          "border-2 border-input bg-white hover:bg-accent/20 hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 border border-secondary/30",
        ghost: "bg-transparent hover:bg-accent/20 hover:text-accent-foreground",
        link: "text-blue-800 underline-offset-4 hover:underline hover:text-blue-900",
      },
      size: {
        default: "min-h-[44px] min-w-[44px] px-4 py-2", // WCAG AAA minimum touch target
        sm: "min-h-[44px] min-w-[44px] rounded-md px-3 py-1.5", // Minimum 44px touch target
        lg: "min-h-[44px] min-w-[44px] rounded-md px-8 py-2.5", // Larger size but still minimum 44px
        icon: "h-[44px] w-[44px]", // WCAG AAA icon button
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
