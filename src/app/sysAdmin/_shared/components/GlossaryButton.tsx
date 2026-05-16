"use client";

import React from "react";
import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  className?: string;
};

/**
 * ページヘッダーに置く用語ガイド icon。MetricInfoButton と同じ Popover
 * 形式で、各メトリクスの popover で重複しがちな前提 (全メンバーの定義、
 * 対象のポイント種別、集計窓の使い分け、送付率の意味など) を 1 箇所に
 * 集約する。
 *
 * UI は MetricInfoButton と意図的に揃える (icon サイズ、align="end"、
 * sideOffset、text 色) — 運営は「右上にある ⓘ」を学習済みなので、
 * 同じ操作パターンで開けるようにする。中身が縦長なので幅は w-80、
 * 高さは max-h-[70vh] でスクロール。
 */
export function GlossaryButton({ className }: Props) {
  const g = sysAdminDashboardJa.glossary;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={g.title}
          className={cn(
            "inline-flex items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className,
          )}
        >
          <Info className="h-4 w-4" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-80 max-h-[70vh] overflow-y-auto text-xs text-muted-foreground"
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-medium text-foreground">{g.title}</h4>
            <p className="leading-relaxed">{g.intro}</p>
          </div>
          {g.sections.map((s) => (
            <section key={s.heading} className="flex flex-col gap-1">
              <h5 className="text-xs font-medium text-foreground">
                {s.heading}
              </h5>
              <p className="whitespace-pre-line leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
