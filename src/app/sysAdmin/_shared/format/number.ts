const PCT_FORMATTER = new Intl.NumberFormat("ja-JP", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const INT_FORMATTER = new Intl.NumberFormat("ja-JP", {
  maximumFractionDigits: 0,
});

export function toPct(value: number | null | undefined, fallback = "-"): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return fallback;
  return PCT_FORMATTER.format(value);
}

export function toSignedPct(value: number | null | undefined, fallback = "-"): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return fallback;
  const sign = value > 0 ? "+" : "";
  return `${sign}${PCT_FORMATTER.format(value)}`;
}

export function toArrowPct(value: number | null | undefined, fallback = "-"): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return fallback;
  if (value === 0) return PCT_FORMATTER.format(0);
  const arrow = value > 0 ? "↑" : "↓";
  return `${arrow}${PCT_FORMATTER.format(Math.abs(value))}`;
}

export function toIntJa(value: number | null | undefined, fallback = "-"): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return fallback;
  return INT_FORMATTER.format(Math.trunc(value));
}

export function toCompactJa(value: number | null | undefined, fallback = "-"): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return fallback;
  const abs = Math.abs(value);
  if (abs >= 1e8) return `${(value / 1e8).toFixed(abs >= 1e9 ? 0 : 1)}億`;
  if (abs >= 1e4) return `${(value / 1e4).toFixed(abs >= 1e5 ? 0 : 1)}万`;
  return INT_FORMATTER.format(Math.trunc(value));
}
