export const COHORT_COLORS = [
  "#1D9E75",
  "#378ADD",
  "#EF9F27",
  "#D85A30",
  "#7F77DD",
  "#888780",
  "#0EA5E9",
  "#A78BFA",
  "#F97316",
  "#22C55E",
  "#EAB308",
  "#94A3B8",
] as const;

export function pickCohortColor(index: number): string {
  return COHORT_COLORS[index % COHORT_COLORS.length] as string;
}
