import { describe, expect, it } from "vitest";
import type { GqlSysAdminCohortRetentionPoint } from "@/types/graphql";
import { buildCohortChartData } from "../buildCohortChartData";

const cohort = (
  month: string,
  retentionM1: number | null,
  retentionM3: number | null,
  retentionM6: number | null,
): GqlSysAdminCohortRetentionPoint => ({
  __typename: "SysAdminCohortRetentionPoint",
  cohortMonth: new Date(month),
  cohortSize: 10,
  retentionM1,
  retentionM3,
  retentionM6,
});

describe("buildCohortChartData", () => {
  it("forces M+0 to 100 for every cohort", () => {
    const data = buildCohortChartData([cohort("2025-10-01T00:00:00+09:00", 0.7, 0.5, 0.3)]);
    const m0Row = data.rows.find((r) => r.n === "M+0");
    expect(m0Row).toBeDefined();
    Object.entries(m0Row!).forEach(([k, v]) => {
      if (k === "n") return;
      expect(v).toBe(100);
    });
  });

  it("converts API fractions to percentages", () => {
    const data = buildCohortChartData([cohort("2025-10-01T00:00:00+09:00", 0.673, 0.5, 0.3)]);
    const label = data.cohortLabels[0];
    expect(data.rows.find((r) => r.n === "M+1")?.[label!]).toBeCloseTo(67.3, 1);
    expect(data.rows.find((r) => r.n === "M+3")?.[label!]).toBeCloseTo(50, 1);
    expect(data.rows.find((r) => r.n === "M+6")?.[label!]).toBeCloseTo(30, 1);
  });

  it("preserves null for missing API values", () => {
    const data = buildCohortChartData([cohort("2026-01-01T00:00:00+09:00", 0.5, null, null)]);
    const label = data.cohortLabels[0]!;
    expect(data.rows.find((r) => r.n === "M+0")?.[label]).toBe(100);
    expect(data.rows.find((r) => r.n === "M+1")?.[label]).toBeCloseTo(50, 1);
    expect(data.rows.find((r) => r.n === "M+3")?.[label]).toBeNull();
    expect(data.rows.find((r) => r.n === "M+6")?.[label]).toBeNull();
  });

  it("slices to the most recent N cohorts when maxCohorts > 0", () => {
    const data = buildCohortChartData(
      [
        cohort("2025-08-01T00:00:00+09:00", 0.6, null, null),
        cohort("2025-09-01T00:00:00+09:00", 0.65, null, null),
        cohort("2025-10-01T00:00:00+09:00", 0.7, null, null),
        cohort("2025-11-01T00:00:00+09:00", 0.75, null, null),
      ],
      2,
    );
    expect(data.cohortLabels).toHaveLength(2);
    expect(data.cohortLabels).toEqual(["25/10", "25/11"]);
  });

  it("returns all cohorts when maxCohorts = 0", () => {
    const data = buildCohortChartData(
      [
        cohort("2025-09-01T00:00:00+09:00", 0.6, null, null),
        cohort("2025-10-01T00:00:00+09:00", 0.65, null, null),
        cohort("2025-11-01T00:00:00+09:00", 0.7, null, null),
      ],
      0,
    );
    expect(data.cohortLabels).toHaveLength(3);
  });

  it("handles empty input", () => {
    const data = buildCohortChartData([]);
    expect(data.cohortLabels).toEqual([]);
    expect(data.rows).toHaveLength(4); // M+0/1/3/6 still present, but no cohort columns
  });
});
