"use client";

import { GqlSysAdminSortOrder, GqlSysAdminUserSortField } from "@/types/graphql";
import { cn } from "@/lib/utils";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import type { MemberSort } from "../hooks/useDetailControls";

type Column = {
  key: GqlSysAdminUserSortField;
  label: string;
  className?: string;
};

type Props = {
  sort: MemberSort;
  onToggle: (field: GqlSysAdminUserSortField) => void;
};

export function MemberSortHeader({ sort, onToggle }: Props) {
  const cols = sysAdminDashboardJa.detail.member.columns;
  const columns: Column[] = [
    { key: GqlSysAdminUserSortField.SendRate, label: cols.sendRate, className: "w-24" },
    { key: GqlSysAdminUserSortField.TotalPointsOut, label: cols.totalPointsOut, className: "w-28" },
    { key: GqlSysAdminUserSortField.DonationOutMonths, label: cols.donationOutMonths, className: "w-24" },
    { key: GqlSysAdminUserSortField.MonthsIn, label: cols.monthsIn, className: "w-24" },
  ];

  return (
    <div className="flex items-center border-b bg-muted/30 px-3 py-2 text-xs font-medium text-muted-foreground">
      <div className="flex-1">{cols.name}</div>
      {columns.map((c) => {
        const isActive = sort.field === c.key;
        return (
          <button
            key={c.key}
            type="button"
            onClick={() => onToggle(c.key)}
            aria-pressed={isActive}
            className={cn(
              "flex items-center justify-end gap-1 text-right",
              c.className,
              isActive && "text-foreground",
            )}
          >
            <span>{c.label}</span>
            {isActive && (
              <span aria-hidden>{sort.order === GqlSysAdminSortOrder.Asc ? "▲" : "▼"}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
