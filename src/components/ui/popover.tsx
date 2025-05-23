
import * as React from "react"
import {
  Root as PopoverRoot,
  Trigger as PopoverPrimitiveTrigger,
  Content as PopoverPrimitiveContent,
  Portal as PopoverPrimitivePortal
} from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverRoot

const PopoverTrigger = PopoverPrimitiveTrigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitiveContent>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitiveContent>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitivePortal>
    <PopoverPrimitiveContent
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitivePortal>
))
PopoverContent.displayName = PopoverPrimitiveContent.displayName

export { Popover, PopoverTrigger, PopoverContent }
