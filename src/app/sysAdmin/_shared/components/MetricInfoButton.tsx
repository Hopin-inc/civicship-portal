"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { METRIC_DEFINITIONS, type MetricKey } from "./MetricDefinitions";

type Props = {
  metricKey: MetricKey;
  className?: string;
};

export function MetricInfoButton({ metricKey, className }: Props) {
  const [open, setOpen] = useState(false);
  const def = METRIC_DEFINITIONS[metricKey];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${def.title}の定義を見る`}
        className={cn(
          "inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground",
          className,
        )}
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{def.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div>
              <p className="mb-1 text-xs text-muted-foreground">計算式</p>
              <p>{def.formula}</p>
            </div>
            {def.note && (
              <div>
                <p className="mb-1 text-xs text-muted-foreground">補足</p>
                <p>{def.note}</p>
              </div>
            )}
            {def.range && (
              <div>
                <p className="mb-1 text-xs text-muted-foreground">値の範囲</p>
                <p>{def.range}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
