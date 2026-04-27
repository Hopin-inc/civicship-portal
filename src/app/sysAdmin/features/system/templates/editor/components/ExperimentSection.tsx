"use client";

import { AlertTriangle } from "lucide-react";
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
        <p className="text-body-sm text-muted-foreground">対象 template がありません</p>
      </section>
    );
  }

  return (
    <section className="space-y-2">
      <h3 className="text-body-sm font-semibold">実験</h3>
      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-body-xs tabular-nums">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <Th>ver</Th>
              <Th>experiment</Th>
              <Th align="right">weight</Th>
              <Th align="center">active</Th>
              <Th align="right">feedback</Th>
              <Th align="right">avgR</Th>
              <Th align="right">judge相関</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.templateId}
                className={cn(
                  "border-t border-border",
                  !row.isActive && "text-muted-foreground",
                )}
              >
                <Td>v{row.version}</Td>
                <Td>{row.experimentKey ?? "—"}</Td>
                <Td align="right">{row.trafficWeight}%</Td>
                <Td align="center">
                  {row.isActive ? (row.isEnabled ? "✓" : "○") : "−"}
                </Td>
                <Td align="right">{row.feedbackCount}</Td>
                <Td align="right">
                  {row.avgRating != null ? row.avgRating.toFixed(2) : "—"}
                </Td>
                <Td align="right">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1",
                      row.correlationWarning && "text-destructive",
                    )}
                  >
                    {row.judgeHumanCorrelation != null
                      ? row.judgeHumanCorrelation.toFixed(2)
                      : "—"}
                    {row.correlationWarning && <AlertTriangle className="h-3 w-3" />}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
}) {
  return (
    <th
      className={cn(
        "px-2 py-1 font-medium",
        align === "right" && "text-right",
        align === "center" && "text-center",
        align === "left" && "text-left",
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
}) {
  return (
    <td
      className={cn(
        "px-2 py-1.5",
        align === "right" && "text-right",
        align === "center" && "text-center",
        align === "left" && "text-left",
      )}
    >
      {children}
    </td>
  );
}
