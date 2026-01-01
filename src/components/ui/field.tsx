"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

/**
 * Field - useState/直接管理用のフォームフィールドラッパー
 * react-hook-formを使わないシンプルなフォーム向け
 */

const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-2", className)} {...props} />;
});
Field.displayName = "Field";

const FieldLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label> & {
    required?: boolean;
  }
>(({ className, required, children, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn(
        required && 'after:ml-0.5 after:text-destructive after:content-["*"]',
        className
      )}
      {...props}
    >
      {children}
    </Label>
  );
});
FieldLabel.displayName = "FieldLabel";

const FieldControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={className} {...props} />;
});
FieldControl.displayName = "FieldControl";

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FieldDescription.displayName = "FieldDescription";

const FieldMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    error?: boolean;
  }
>(({ className, error, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "text-sm font-medium",
        error ? "text-destructive" : "text-muted-foreground",
        className
      )}
      {...props}
    />
  );
});
FieldMessage.displayName = "FieldMessage";

/**
 * FieldRow - ラベルと入力を横並びにするフィールド
 * 数値入力などコンパクトなフォームに適している
 */
const FieldRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-between gap-4", className)}
      {...props}
    />
  );
});
FieldRow.displayName = "FieldRow";

export {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldMessage,
  FieldRow,
};
