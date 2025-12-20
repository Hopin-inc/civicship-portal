"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toggleVariants = cva(
  cn(
    "inline-flex items-center justify-center rounded-md",
    "text-label-md font-medium transition-colors",
    "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2",

    // ▼ 追加：OFF 状態のベース
    "data-[state=off]:border",
    "data-[state=off]:border-border",
    "data-[state=off]:bg-background",
    "data-[state=off]:text-muted-foreground",

    // 既存：ON 状態
    "data-[state=on]:border-2",
    "data-[state=on]:font-bold",
  ),
  {
    variants: {
      variant: {
        default: "",
        outline:
          "border border-input bg-background hover:bg-background-hover hover:text-foreground",
      },
      size: {
        sm: "h-10 px-3 py-2 text-label-sm",
        md: "h-12 px-4 py-2 text-label-md",
        lg: "h-14 px-8 py-2 text-label-lg",
      },
      color: {
        primary:
          "data-[state=on]:bg-primary-foreground data-[state=on]:text-primary data-[state=on]:border-primary",
        danger:
          "data-[state=on]:bg-danger-foreground data-[state=on]:text-danger data-[state=on]:border-danger",
        warning:
          "data-[state=on]:bg-warning-foreground data-[state=on]:text-warning data-[state=on]:border-warning",
        success:
          "data-[state=on]:bg-success-foreground data-[state=on]:text-success data-[state=on]:border-success",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      color: "primary",
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
