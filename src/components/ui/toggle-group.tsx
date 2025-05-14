
import * as React from "react"
import {
  Root as ToggleGroupRoot, 
  Item as ToggleGroupPrimitiveItem
} from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupRoot>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupRoot> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupRoot
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupRoot>
))

ToggleGroup.displayName = ToggleGroupRoot.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitiveItem>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitiveItem> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitiveItem
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitiveItem>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitiveItem.displayName

export { ToggleGroup, ToggleGroupItem }
