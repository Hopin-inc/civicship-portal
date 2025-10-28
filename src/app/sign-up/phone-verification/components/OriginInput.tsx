import * as React from "react";

import { cn } from "@/lib/utils";

export interface OriginInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Origin UI-styled Input component
 * Based on Origin UI (https://coss.com/origin/input)
 * 
 * Key features:
 * - shadow-xs for subtle depth
 * - ring-[3px] for prominent focus state
 * - aria-invalid styling support
 * - Special handling for search and file input types
 * - forwardRef support for react-phone-number-input compatibility
 * - iOS 16px font-size workaround to prevent zoom
 */
const OriginInput = React.forwardRef<HTMLInputElement, OriginInputProps>(
  ({ className, type, style, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          type === "search" &&
            "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
          type === "file" &&
            "p-0 pr-3 text-muted-foreground/70 italic file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-input file:bg-transparent file:px-3 file:text-sm file:font-medium file:text-foreground file:not-italic",
          className,
        )}
        ref={ref}
        style={{ fontSize: "16px", ...style }} // Prevents zoom on iOS devices
        {...props}
      />
    );
  },
);
OriginInput.displayName = "OriginInput";

export { OriginInput };
