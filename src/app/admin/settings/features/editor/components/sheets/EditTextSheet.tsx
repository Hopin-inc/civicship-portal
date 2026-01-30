"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface EditTextSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  value: string;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  saving?: boolean;
}

export function EditTextSheet({
  open,
  onOpenChange,
  title,
  value,
  onSave,
  placeholder,
  multiline = false,
  maxLength,
  saving = false,
}: EditTextSheetProps) {
  const [localValue, setLocalValue] = useState(value);

  // シートが開くたびに値をリセット
  useEffect(() => {
    if (open) {
      setLocalValue(value);
    }
  }, [open, value]);

  const handleSave = async () => {
    await onSave(localValue);
    onOpenChange(false);
  };

  const isDirty = localValue !== value;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-w-md mx-auto p-6 overflow-y-auto max-h-[70vh]"
      >
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="text-title-sm">{title}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {multiline ? (
            <Textarea
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              placeholder={placeholder}
              maxLength={maxLength}
              className="min-h-[200px]"
            />
          ) : (
            <Input
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              placeholder={placeholder}
              maxLength={maxLength}
            />
          )}

          {maxLength && (
            <p className="text-xs text-muted-foreground text-right">
              {localValue.length} / {maxLength}
            </p>
          )}

          <Button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="w-full"
          >
            {saving ? "保存中..." : "保存"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
