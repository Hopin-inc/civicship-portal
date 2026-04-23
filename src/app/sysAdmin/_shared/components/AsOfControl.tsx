"use client";

import React, { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MetricInfoButton } from "@/app/sysAdmin/_shared/components/MetricInfoButton";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
  id?: string;
  disabled?: boolean;
};

export function AsOfControl({ value, onChange, id = "asOf", disabled }: Props) {
  const toDateInputValue = (iso: string | null): string => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
    return `${jst.getUTCFullYear()}-${String(jst.getUTCMonth() + 1).padStart(2, "0")}-${String(
      jst.getUTCDate(),
    ).padStart(2, "0")}`;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!raw) {
      onChange(null);
      return;
    }
    const [y, m, d] = raw.split("-").map((v) => Number(v));
    const iso = new Date(Date.UTC(y, m - 1, d, 15, 0, 0)).toISOString();
    onChange(iso);
  };

  return (
    <div className="flex items-center gap-1">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {sysAdminDashboardJa.controls.asOfLabel}
      </Label>
      <MetricInfoButton metricKey="asOf" className="h-6 w-6" />
      <Input
        id={id}
        type="date"
        value={toDateInputValue(value)}
        onChange={handleChange}
        disabled={disabled}
        className="h-9 w-36 sm:w-40"
      />
    </div>
  );
}
