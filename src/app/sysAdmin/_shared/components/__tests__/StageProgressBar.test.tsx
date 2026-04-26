import { describe, expect, it } from "vitest";
import { computeStagePercentages } from "../StageProgressBar";

describe("computeStagePercentages", () => {
  it("computes percentages summing to 100 for non-empty input", () => {
    const pct = computeStagePercentages({
      habitual: 30,
      regular: 40,
      occasional: 25,
      latent: 25,
    });
    const sum = pct.habitual + pct.regular + pct.occasional + pct.latent;
    expect(sum).toBeCloseTo(100, 5);
    expect(pct.habitual).toBeCloseTo(25, 5);
    expect(pct.regular).toBeCloseTo(33.33, 1);
  });

  it("returns all zeros when total is 0", () => {
    const pct = computeStagePercentages({
      habitual: 0,
      regular: 0,
      occasional: 0,
      latent: 0,
    });
    expect(pct.habitual).toBe(0);
    expect(pct.regular).toBe(0);
    expect(pct.occasional).toBe(0);
    expect(pct.latent).toBe(0);
  });

  it("handles single-stage population", () => {
    const pct = computeStagePercentages({
      habitual: 10,
      regular: 0,
      occasional: 0,
      latent: 0,
    });
    expect(pct.habitual).toBe(100);
    expect(pct.latent).toBe(0);
  });
});
