"use client";

import React from "react";
import { GqlSysAdminUserSortField } from "@/types/graphql";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  field: GqlSysAdminUserSortField;
  onChange: (field: GqlSysAdminUserSortField) => void;
};

export function MemberSortSelect({ field, onChange }: Props) {
  const labels = sysAdminDashboardJa.detail.member.sort;
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="member-sort" className="text-xs text-muted-foreground">
        {labels.placeholder}
      </Label>
      <Select value={field} onValueChange={(v) => onChange(v as GqlSysAdminUserSortField)}>
        <SelectTrigger id="member-sort" className="h-9 w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={GqlSysAdminUserSortField.SendRate}>{labels.sendRate}</SelectItem>
          <SelectItem value={GqlSysAdminUserSortField.MonthsIn}>{labels.monthsIn}</SelectItem>
          <SelectItem value={GqlSysAdminUserSortField.DonationOutMonths}>
            {labels.donationOutMonths}
          </SelectItem>
          <SelectItem value={GqlSysAdminUserSortField.TotalPointsOut}>
            {labels.totalPointsOut}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
