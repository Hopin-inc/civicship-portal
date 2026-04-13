"use client";

import { Delete } from "lucide-react";
import { cn } from "@/lib/utils";

const NUMPAD_KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["AC", "0", "backspace"],
] as const;

export type NumpadKey = (typeof NUMPAD_KEYS)[number][number];

interface NumpadProps {
  onKey: (key: NumpadKey) => void;
  className?: string;
}

function Numpad({ onKey, className }: NumpadProps) {
  return (
    <div className={cn("px-4 pt-5 pb-6", className)}>
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
        {NUMPAD_KEYS.flat().map((key) => (
          <button
            key={key}
            onClick={() => onKey(key)}
            className="flex items-center justify-center aspect-square rounded-2xl bg-background text-xl font-semibold text-foreground active:bg-muted transition-colors select-none shadow-sm"
          >
            {key === "backspace" ? <Delete className="w-6 h-6" /> : key}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Numpad;
