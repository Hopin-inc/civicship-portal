"use client";

import { AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { TemplateBreakdownRow } from "@/app/sysAdmin/features/system/templates/shared/fixtures";

type Props = {
  rows: TemplateBreakdownRow[];
};

/**
 * A/B 候補一覧を table 形式で表示。
 * 同 variant 内で「どの template が並列稼働しているか」「各々の評価指標」が一目でわかる。
 */
export function ExperimentSection({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <section className="space-y-2">
        <h3 className="text-body-sm font-semibold">実験</h3>
        <p className="text-body-sm text-muted-foreground">
          対象 template がありません
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-2">
      <h3 className="text-body-sm font-semibold">実験</h3>
      <div className="overflow-hidden rounded border border-border">
        <Table className="text-body-xs tabular-nums">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="h-8 px-2 py-1">ver</TableHead>
              <TableHead className="h-8 px-2 py-1">experiment</TableHead>
              <TableHead className="h-8 px-2 py-1 text-right">weight</TableHead>
              <TableHead className="h-8 px-2 py-1 text-center">active</TableHead>
              <TableHead className="h-8 px-2 py-1 text-right">feedback</TableHead>
              <TableHead className="h-8 px-2 py-1 text-right">avgR</TableHead>
              <TableHead className="h-8 px-2 py-1 text-right">judge相関</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.templateId}
                className={cn(!row.isActive && "text-muted-foreground")}
              >
                <TableCell className="px-2 py-1.5">v{row.version}</TableCell>
                <TableCell className="px-2 py-1.5">
                  {row.experimentKey ?? "—"}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-right">
                  {row.trafficWeight}%
                </TableCell>
                <TableCell className="px-2 py-1.5 text-center">
                  {row.isActive ? (row.isEnabled ? "✓" : "○") : "−"}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-right">
                  {row.feedbackCount}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-right">
                  {row.avgRating != null ? row.avgRating.toFixed(2) : "—"}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-right">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1",
                      row.correlationWarning && "text-destructive",
                    )}
                  >
                    {row.judgeHumanCorrelation != null
                      ? row.judgeHumanCorrelation.toFixed(2)
                      : "—"}
                    {row.correlationWarning && (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
