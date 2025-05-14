
import * as React from "react"
import { 
  Root as DialogRoot,
  Trigger as DialogPrimitiveTrigger,
  Portal as DialogPrimitivePortal,
  Close as DialogPrimitiveClose,
  Overlay as DialogPrimitiveOverlay,
  Content as DialogPrimitiveContent,
  Title as DialogPrimitiveTitle,
  Description as DialogPrimitiveDescription
} from "@radix-ui/react-dialog"
import { X } from "@/components/icons"

import { cn } from "@/lib/utils"

const Dialog = DialogRoot

const DialogTrigger = DialogPrimitiveTrigger

const DialogPortal = DialogPrimitivePortal

const DialogClose = DialogPrimitiveClose

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitiveOverlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitiveOverlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitiveOverlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitiveOverlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitiveContent>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitiveContent>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitiveContent
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitiveClose className="absolute right-4 top-4 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-transparent data-[state=open]:text-neutral-700 w-6 h-6 flex items-center justify-center hover:bg-neutral-100">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitiveClose>
    </DialogPrimitiveContent>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitiveContent.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitiveTitle>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitiveTitle>
>(({ className, ...props }, ref) => (
  <DialogPrimitiveTitle
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitiveTitle.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitiveDescription>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitiveDescription>
>(({ className, ...props }, ref) => (
  <DialogPrimitiveDescription
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitiveDescription.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
