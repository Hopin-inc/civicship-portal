import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        colored: "border-transparent",
        primary: "border-transparent bg-primary !text-primary-foreground",
        secondary: "border-primary bg-secondary !text-secondary-foreground",
        warning: "border-transparent bg-amber-400 !text-white",
        destructive: "border-transparent bg-destructive !text-destructive-foreground",
        success: "border-transparent bg-green-500 !text-white",
        outline: "!text-foreground",
      },
      size: {
        sm: "px-2.5 py-0.5 text-label-sm",
        md: "px-3 py-1 text-label-md",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, color, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant, size }),
        color && `bg-${color} text-${color}-foreground`,
        className,
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
