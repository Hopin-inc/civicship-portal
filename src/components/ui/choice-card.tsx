"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

/**
 * ChoiceCard - カード型の選択肢UI
 * ラジオボタンの代わりに使用する視覚的な選択UI
 */

interface ChoiceOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface ChoiceCardGroupProps<T extends string = string> {
  value: T;
  onValueChange: (value: T) => void;
  options: ChoiceOption<T>[];
  disabled?: boolean;
  className?: string;
}

export function ChoiceCardGroup<T extends string = string>({
  value,
  onValueChange,
  options,
  disabled = false,
  className,
}: ChoiceCardGroupProps<T>) {
  return (
    <div className={cn("grid gap-3", className)}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => !disabled && onValueChange(option.value)}
            disabled={disabled}
            className={cn(
              "relative flex items-start gap-4 rounded-lg border-2 p-4 text-left transition-all",
              "hover:bg-accent/50",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              isSelected
                ? "border-primary bg-primary/5"
                : "border-input bg-background",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {/* アイコン */}
            {option.icon && (
              <div className="flex-shrink-0 mt-0.5">{option.icon}</div>
            )}

            {/* ラベルと説明 */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{option.label}</div>
              {option.description && (
                <div className="text-sm text-muted-foreground mt-1">
                  {option.description}
                </div>
              )}
            </div>

            {/* 選択マーク */}
            {isSelected && (
              <div className="flex-shrink-0">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
