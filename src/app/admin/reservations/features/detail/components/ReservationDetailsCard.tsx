import React from "react";
import { DetailRow } from "../presenters/presentReservationDetailRows";
import { cn } from "@/lib/utils";

interface ReservationDetailsCardProps {
  rows: DetailRow[];
}

export function ReservationDetailsCard({ rows }: ReservationDetailsCardProps) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border shadow-sm bg-card">
      {rows.map((row, index) => {
        const isLast = index === rows.length - 1;
        const isComment = row.isComment;

        if (isComment) {
          // コメントは特別レイアウト（縦並び）
          return (
            <dl key={row.key} className="p-5">
              <dt className="text-label-sm font-bold mb-2">{row.label}</dt>
              <dd className="text-body-sm">{row.value}</dd>
            </dl>
          );
        }

        // 通常の行（横並び）
        return (
          <dl
            key={row.key}
            className={cn(
              "flex justify-between items-center py-5 px-5",
              !isLast && "border-b border-foreground-caption",
            )}
          >
            <dt className="text-label-sm font-bold">{row.label}</dt>
            <dd className="text-body-sm text-right flex-1 min-w-0 ml-4">{row.value}</dd>
          </dl>
        );
      })}
    </div>
  );
}
