"use client";

import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { METRIC_DEFINITIONS, type MetricKey } from "./MetricDefinitions";

type Section = {
  heading: string;
  keys: MetricKey[];
};

// L1 row に表示している指標とその直接的な前提だけに絞る。L2 詳細で必要な
// 個人指標 / コホート / WAU 構成は別途 L2 側で glossary を持つ想定。
const SECTIONS: Section[] = [
  {
    heading: "主指標",
    keys: ["mau", "communityActivityRate", "growthRateActivity", "newMembers", "activityFlow"],
  },
  { heading: "ステージ", keys: ["hubUserPct", "stages", "userSendRate"] },
  { heading: "設定", keys: ["asOf"] },
];

type Props = {
  className?: string;
};

export function MetricGlossaryButton({ className }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("gap-1.5", className)}
        onClick={() => setOpen(true)}
      >
        <BookOpen className="h-4 w-4" />
        用語
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-sm font-medium text-muted-foreground">
              指標の定義
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5 text-muted-foreground">
            {SECTIONS.map((section) => (
              <section key={section.heading} className="flex flex-col gap-2">
                <h3 className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
                  {section.heading}
                </h3>
                <dl className="flex flex-col gap-3">
                  {section.keys.map((key) => {
                    const def = METRIC_DEFINITIONS[key];
                    if (!def) return null;
                    return (
                      <div key={key} className="flex flex-col gap-0.5">
                        <dt className="text-xs font-medium text-foreground/80">
                          {def.title}
                        </dt>
                        <dd className="flex flex-col gap-0.5 text-xs">
                          <p>
                            <span className="mr-1 text-muted-foreground/60">計算式:</span>
                            {def.formula}
                          </p>
                          {def.note && (
                            <p>
                              <span className="mr-1 text-muted-foreground/60">補足:</span>
                              {def.note}
                            </p>
                          )}
                          {def.range && (
                            <p>
                              <span className="mr-1 text-muted-foreground/60">範囲:</span>
                              {def.range}
                            </p>
                          )}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </section>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
