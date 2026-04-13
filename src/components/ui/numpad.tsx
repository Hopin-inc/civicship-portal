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
    <div className={cn("h-full px-10 py-4", className)}>
      <div className="grid grid-cols-3 grid-rows-4 gap-2 h-full max-w-sm mx-auto">
        {NUMPAD_KEYS.flat().map((key) => (
          <button
            key={key}
            onClick={() => onKey(key)}
            className="flex items-center justify-center w-full h-full rounded-2xl bg-background text-xl font-semibold text-foreground active:bg-muted transition-colors select-none shadow-sm"
          >
            {key === "backspace" ? <Delete className="w-6 h-6" /> : key}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Numpad;
