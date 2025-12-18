import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary !text-primary-foreground hover:bg-primary-hover font-bold disabled:bg-muted disabled:!text-muted-foreground",
        secondary:
          "border border-secondary-foreground bg-secondary hover:bg-secondary-hover !text-secondary-foreground font-bold disabled:border-muted-foreground disabled:!text-muted-foreground",
        tertiary:
          "border border-border bg-tertiary hover:bg-tertiary-hover !text-tertiary-foreground font-bold disabled:!text-muted-foreground",
        text: "underline hover:opacity-50 disabled:!text-muted-foreground",
        "icon-only": "",
        destructive:
          "bg-destructive !text-destructive-foreground hover:bg-destructive-hover font-bold disabled:bg-muted disabled:!text-muted-foreground",
        "destructive-outline":
          "border border-destructive !text-destructive bg-transparent hover:bg-destructive/10 disabled:border-muted disabled:!text-muted-foreground",
        link: "!text-primary underline-offset-4 hover:underline disabled:!text-muted-foreground",
      },
      size: {
        sm: "h-10 px-4 py-2 text-label-sm",
        md: "h-12 px-6 py-2 text-label-md",
        lg: "h-14 px-8 py-2 text-label-lg",
        icon: "h-10 w-10",
        selection: "h-16 w-40 text-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
