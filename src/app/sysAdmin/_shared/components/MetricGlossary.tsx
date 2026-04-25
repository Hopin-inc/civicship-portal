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

/**
 * セクション分けは「admin が読みたい順」を意識する。
 * 主指標 → ステージ → コホート → 週次 → メンバー → コミュニティ → 設定。
 */
const SECTIONS: Section[] = [
  {
    heading: "主指標",
    keys: ["mau", "communityActivityRate", "growthRateActivity", "newMembers", "activityFlow"],
  },
  { heading: "ステージ分類", keys: ["stages", "userSendRate", "hubUserPct"] },
  { heading: "コホート", keys: ["cohortRetention"] },
  {
    heading: "WAU 構成 (週次)",
    keys: ["wau", "retainedSenders", "churnedSenders", "returnedSenders"],
  },
  {
    heading: "メンバー指標",
    keys: ["monthsIn", "donationOutMonths", "totalPointsOut"],
  },
  {
    heading: "コミュニティ指標",
    keys: ["totalDonationPointsAllTime", "maxChainDepthAllTime", "chainPct"],
  },
  { heading: "画面設定", keys: ["asOf"] },
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
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>指標の定義</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-6">
            {SECTIONS.map((section) => (
              <section key={section.heading} className="flex flex-col gap-3">
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {section.heading}
                </h3>
                <dl className="flex flex-col gap-4">
                  {section.keys.map((key) => {
                    const def = METRIC_DEFINITIONS[key];
                    if (!def) return null;
                    return (
                      <div key={key} className="flex flex-col gap-1">
                        <dt className="text-sm font-semibold">{def.title}</dt>
                        <dd className="flex flex-col gap-1 text-sm">
                          <p className="text-muted-foreground">
                            <span className="mr-1 text-xs text-muted-foreground/70">計算式:</span>
                            {def.formula}
                          </p>
                          {def.note && (
                            <p className="text-muted-foreground">
                              <span className="mr-1 text-xs text-muted-foreground/70">補足:</span>
                              {def.note}
                            </p>
                          )}
                          {def.range && (
                            <p className="text-muted-foreground">
                              <span className="mr-1 text-xs text-muted-foreground/70">範囲:</span>
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
