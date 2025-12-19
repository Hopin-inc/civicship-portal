"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface SingleSlotFormProps {
  startAt: string;
  endAt: string;
  onStartAtChange: (value: string) => void;
  onEndAtChange: (value: string) => void;
  onAdd: () => void;
  variant?: "primary" | "secondary";
  title?: string;
}

export function SingleSlotForm({
  startAt,
  endAt,
  onStartAtChange,
  onEndAtChange,
  onAdd,
  variant = "primary",
  title,
}: SingleSlotFormProps) {
  const isDisabled = !startAt || !endAt;

  return (
    <div className="space-y-3">
      {title && <p className="text-sm font-medium">{title}</p>}

      <div className="space-y-1">
        <label className="text-sm text-muted-foreground px-1">開始日時</label>
        <Input
          type="datetime-local"
          value={startAt}
          onChange={(e) => onStartAtChange(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-muted-foreground px-1">終了日時</label>
        <Input
          type="datetime-local"
          value={endAt}
          onChange={(e) => onEndAtChange(e.target.value)}
        />
      </div>

      <Button
        onClick={onAdd}
        disabled={isDisabled}
        className="w-full"
        variant={variant === "secondary" ? "secondary" : undefined}
      >
        <Plus className="h-4 w-4 mr-2" />
        追加
      </Button>
    </div>
  );
}
