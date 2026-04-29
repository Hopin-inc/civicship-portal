import type { GqlAnalyticsCohortRetentionPoint } from "@/types/graphql";
import { formatJstMonthShort } from "@/app/sysAdmin/_shared/format/date";

export type CohortAxisPoint = "M+0" | "M+1" | "M+3" | "M+6";

const POINTS: readonly CohortAxisPoint[] = ["M+0", "M+1", "M+3", "M+6"];

export type CohortChartRow = {
  n: CohortAxisPoint;
  /** Each key is a cohort label (`formatJstMonthShort(cohortMonth)`), value is % (0-100) or null */
  [cohortLabel: string]: number | null | string;
};

export type CohortChartData = {
  rows: CohortChartRow[];
  cohortLabels: string[];
};

/**
 * Build chart-ready data for the cohort overlapping area chart.
 * - M+0 is forced to 100 for every cohort (start point)
 * - M+1/M+3/M+6 use API values × 100, or null when API returns null
 * - cohorts are limited to the most recent `maxCohorts` entries (or all when 0)
 */
export function buildCohortChartData(
  rawRows: readonly GqlAnalyticsCohortRetentionPoint[],
  maxCohorts = 0,
): CohortChartData {
  const sliced =
    maxCohorts > 0 && rawRows.length > maxCohorts ? rawRows.slice(-maxCohorts) : [...rawRows];

  const cohortLabels = sliced.map((r) => formatJstMonthShort(r.cohortMonth));

  const rows: CohortChartRow[] = POINTS.map((point) => {
    const row: CohortChartRow = { n: point };
    sliced.forEach((cohort, index) => {
      const label = cohortLabels[index] ?? "";
      let value: number | null;
      switch (point) {
        case "M+0":
          value = 100;
          break;
        case "M+1":
          value = cohort.retentionM1 != null ? cohort.retentionM1 * 100 : null;
          break;
        case "M+3":
          value = cohort.retentionM3 != null ? cohort.retentionM3 * 100 : null;
          break;
        case "M+6":
          value = cohort.retentionM6 != null ? cohort.retentionM6 * 100 : null;
          break;
        default:
          value = null;
      }
      row[label] = value;
    });
    return row;
  });

  return { rows, cohortLabels };
}
