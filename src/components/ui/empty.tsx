import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const Empty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center text-center", className)}
    {...props}
  />
))
Empty.displayName = "Empty"

const EmptyHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center space-y-3", className)}
    {...props}
  />
))
EmptyHeader.displayName = "EmptyHeader"

const emptyMediaVariants = cva(
  "flex items-center justify-center rounded-full mb-2",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground p-4",
        gradient: "bg-gradient-to-br from-primary/10 to-primary/5 text-primary p-4",
      },
      size: {
        sm: "h-12 w-12",
        md: "h-16 w-16",
        lg: "h-20 w-20",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface EmptyMediaProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyMediaVariants> {}

const EmptyMedia = React.forwardRef<HTMLDivElement, EmptyMediaProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(emptyMediaVariants({ variant, size, className }))}
      {...props}
    />
  )
)
EmptyMedia.displayName = "EmptyMedia"

const EmptyTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-display-md font-bold", className)}
    {...props}
  />
))
EmptyTitle.displayName = "EmptyTitle"

const EmptyDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-body-md text-muted-foreground whitespace-pre-line", className)}
    {...props}
  />
))
EmptyDescription.displayName = "EmptyDescription"

const EmptyContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-6 flex flex-col gap-2", className)}
    {...props}
  />
))
EmptyContent.displayName = "EmptyContent"

export {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
}
