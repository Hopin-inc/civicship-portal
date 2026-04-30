import { describe, expect, it } from "vitest";
import {
  COHORT_M1_ALERT_THRESHOLD,
  computeParetoTopShare,
  countContinuingSenders,
  D30_COHORT_WINDOW,
  deriveAvgMonthlyPerMember,
  deriveAvgMonthlyThroughput,
  deriveAvgRecipients,
  deriveCohortM1Delta,
  deriveCommunityAgeMonths,
  deriveD30ActivationRate,
  deriveDonationMoM,
  deriveNewMemberRate,
  deriveRecipientToSenderRate,
  deriveRecoveryRate,
  deriveRecoverySeries,
  deriveSentCount,
  deriveTenuredRatioFromMemberList,
  deriveWeeklyContinuationRate,
  deriveWeeklyContinuationSeries,
  FUNNEL_CONTINUING_MIN_MONTHS,
  isCohortM1Alert,
  isRegularOverHabitual,
  TENURE_THRESHOLD_DAYS,
} from "../derive";

describe("deriveRecipientToSenderRate", () => {
  it("returns null when memberList is undersampled (hasNextPage)", () => {
    const users = [
      { totalPointsIn: 10, totalPointsOut: 5 },
      { totalPointsIn: 0, totalPointsOut: 3 },
    ];
    expect(deriveRecipientToSenderRate(users, true)).toBeNull();
  });

  it("returns null when no recipients", () => {
    const users = [{ totalPointsIn: 0, totalPointsOut: 5 }];
    expect(deriveRecipientToSenderRate(users, false)).toBeNull();
  });

  it("returns null on empty users", () => {
    expect(deriveRecipientToSenderRate([], false)).toBeNull();
  });

  it("computes recipients-with-send / recipients ratio", () => {
    const users = [
      { totalPointsIn: 10, totalPointsOut: 5 }, // recipient + sender
      { totalPointsIn: 8, totalPointsOut: 0 }, // recipient only
      { totalPointsIn: 0, totalPointsOut: 4 }, // sender only (excluded)
      { totalPointsIn: 6, totalPointsOut: 2 }, // recipient + sender
    ];
    expect(deriveRecipientToSenderRate(users, false)).toBeCloseTo(2 / 3, 6);
  });
});

describe("deriveAvgRecipients", () => {
  it("returns 0 on empty input", () => {
    expect(deriveAvgRecipients([])).toBe(0);
  });

  it("computes mean uniqueDonationRecipients", () => {
    const members = [
      { uniqueDonationRecipients: 2 },
      { uniqueDonationRecipients: 4 },
      { uniqueDonationRecipients: 6 },
    ];
    expect(deriveAvgRecipients(members)).toBe(4);
  });
});

describe("deriveDonationMoM", () => {
  it("returns null when fewer than 2 months", () => {
    expect(deriveDonationMoM([])).toBeNull();
    expect(deriveDonationMoM([{ donationPointsSum: 100 }])).toBeNull();
  });

  it("returns null when prev is zero", () => {
    expect(
      deriveDonationMoM([
        { donationPointsSum: 0 },
        { donationPointsSum: 200 },
      ]),
    ).toBeNull();
  });

  it("computes MoM growth rate", () => {
    expect(
      deriveDonationMoM([
        { donationPointsSum: 100 },
        { donationPointsSum: 150 },
      ]),
    ).toBeCloseTo(0.5, 6);
  });

  it("uses last two of trend, ignoring earlier history", () => {
    expect(
      deriveDonationMoM([
        { donationPointsSum: 999 },
        { donationPointsSum: 200 },
        { donationPointsSum: 100 },
      ]),
    ).toBeCloseTo(-0.5, 6);
  });
});

describe("deriveCommunityAgeMonths", () => {
  it("returns null on missing endpoints", () => {
    expect(deriveCommunityAgeMonths(null, "2026-01-01")).toBeNull();
    expect(deriveCommunityAgeMonths("2026-01-01", undefined)).toBeNull();
    expect(deriveCommunityAgeMonths(null, null)).toBeNull();
  });

  it("returns 0 for same date", () => {
    expect(deriveCommunityAgeMonths("2026-01-01", "2026-01-01")).toBe(0);
  });

  it("approximates months with 30-day denominator", () => {
    // 90 day diff = 3 months (90/30)
    expect(
      deriveCommunityAgeMonths("2026-01-01T00:00:00Z", "2026-04-01T00:00:00Z"),
    ).toBe(3);
  });

  it("accepts Date objects", () => {
    const from = new Date("2026-01-01T00:00:00Z");
    const to = new Date("2026-02-01T00:00:00Z");
    // Jan→Feb = 31 days, 31/30 ≈ 1.033 → round to 1
    expect(deriveCommunityAgeMonths(from, to)).toBe(1);
  });
});

describe("deriveAvgMonthlyThroughput", () => {
  it("returns null when no points", () => {
    expect(deriveAvgMonthlyThroughput(0, 6)).toBeNull();
  });

  it("returns null when ageMonths is null or non-positive", () => {
    expect(deriveAvgMonthlyThroughput(1000, null)).toBeNull();
    expect(deriveAvgMonthlyThroughput(1000, 0)).toBeNull();
    expect(deriveAvgMonthlyThroughput(1000, -1)).toBeNull();
  });

  it("computes total / ageMonths", () => {
    expect(deriveAvgMonthlyThroughput(1200, 6)).toBe(200);
  });
});

describe("deriveAvgMonthlyPerMember", () => {
  it("returns null when throughput is null", () => {
    expect(deriveAvgMonthlyPerMember(null, 100)).toBeNull();
  });

  it("returns null when totalMembers is 0", () => {
    expect(deriveAvgMonthlyPerMember(500, 0)).toBeNull();
  });

  it("computes throughput / totalMembers", () => {
    expect(deriveAvgMonthlyPerMember(500, 100)).toBe(5);
  });
});

describe("computeParetoTopShare", () => {
  it("returns null on empty users", () => {
    expect(computeParetoTopShare([], 0.8)).toBeNull();
  });

  it("returns null when all totals are 0", () => {
    expect(
      computeParetoTopShare(
        [{ totalPointsOut: 0 }, { totalPointsOut: 0 }],
        0.8,
      ),
    ).toBeNull();
  });

  it("returns the index ratio at which cumulative coverage is reached", () => {
    // 4 users with 80, 10, 5, 5. 80%+ on first user → 1/4 = 0.25
    const users = [
      { totalPointsOut: 80 },
      { totalPointsOut: 10 },
      { totalPointsOut: 5 },
      { totalPointsOut: 5 },
    ];
    expect(computeParetoTopShare(users, 0.8)).toBe(0.25);
  });

  it("sorts descending before scanning", () => {
    const users = [
      { totalPointsOut: 5 },
      { totalPointsOut: 5 },
      { totalPointsOut: 10 },
      { totalPointsOut: 80 },
    ];
    expect(computeParetoTopShare(users, 0.8)).toBe(0.25);
  });

  it("returns 1 if no prefix reaches coverage (shouldn't happen but defensive)", () => {
    // coverage > 1 always fails → falls through to return 1
    const users = [{ totalPointsOut: 1 }];
    expect(computeParetoTopShare(users, 1.5)).toBe(1);
  });
});

describe("deriveWeeklyContinuationRate", () => {
  it("returns null on undefined week", () => {
    expect(deriveWeeklyContinuationRate(undefined)).toBeNull();
  });

  it("returns null when both 0", () => {
    expect(
      deriveWeeklyContinuationRate({ retainedSenders: 0, churnedSenders: 0 }),
    ).toBeNull();
  });

  it("computes retained / (retained + churned)", () => {
    expect(
      deriveWeeklyContinuationRate({ retainedSenders: 7, churnedSenders: 3 }),
    ).toBeCloseTo(0.7, 6);
  });
});

describe("deriveWeeklyContinuationSeries", () => {
  it("slices the trailing window", () => {
    const trend = Array.from({ length: 20 }, (_, i) => ({
      retainedSenders: i + 1,
      churnedSenders: 1,
    }));
    const result = deriveWeeklyContinuationSeries(trend, 5);
    expect(result).toHaveLength(5);
    expect(result[0]).toBeCloseTo(16 / 17, 6);
    expect(result[4]).toBeCloseTo(20 / 21, 6);
  });

  it("preserves null for zero-denominator weeks", () => {
    const result = deriveWeeklyContinuationSeries(
      [
        { retainedSenders: 0, churnedSenders: 0 },
        { retainedSenders: 5, churnedSenders: 5 },
      ],
      2,
    );
    expect(result[0]).toBeNull();
    expect(result[1]).toBeCloseTo(0.5, 6);
  });
});

describe("cohort M1 alert", () => {
  it("delta is null when either cohort lacks retentionM1", () => {
    expect(
      deriveCohortM1Delta(
        { retentionM1: null },
        { retentionM1: 0.5 },
      ),
    ).toBeNull();
    expect(
      deriveCohortM1Delta(
        { retentionM1: 0.5 },
        { retentionM1: null },
      ),
    ).toBeNull();
    expect(deriveCohortM1Delta(undefined, { retentionM1: 0.5 })).toBeNull();
  });

  it("delta is latest - prev", () => {
    expect(
      deriveCohortM1Delta(
        { retentionM1: 0.6 },
        { retentionM1: 0.7 },
      ),
    ).toBeCloseTo(-0.1, 6);
  });

  it("isCohortM1Alert triggers at threshold", () => {
    expect(isCohortM1Alert(null)).toBe(false);
    expect(isCohortM1Alert(-0.04)).toBe(false);
    expect(isCohortM1Alert(COHORT_M1_ALERT_THRESHOLD)).toBe(true);
    expect(isCohortM1Alert(-0.1)).toBe(true);
  });
});

describe("deriveD30ActivationRate", () => {
  it("returns null rate when no completed cohorts", () => {
    const result = deriveD30ActivationRate(
      [{ retentionM1: null }, { retentionM1: null }],
    );
    expect(result.rate).toBeNull();
    expect(result.cohortCount).toBe(0);
  });

  it("ignores incomplete cohorts and averages last N", () => {
    const result = deriveD30ActivationRate(
      [
        { retentionM1: 0.2 },
        { retentionM1: 0.3 },
        { retentionM1: 0.4 },
        { retentionM1: 0.5 },
        { retentionM1: null }, // incomplete latest
      ],
      3,
    );
    // last 3 completed: 0.3, 0.4, 0.5 → avg = 0.4
    expect(result.rate).toBeCloseTo(0.4, 6);
    expect(result.cohortCount).toBe(3);
  });

  it("uses default window when omitted", () => {
    expect(D30_COHORT_WINDOW).toBe(3);
    const trend = [
      { retentionM1: 0.1 },
      { retentionM1: 0.2 },
      { retentionM1: 0.3 },
      { retentionM1: 0.4 },
    ];
    const result = deriveD30ActivationRate(trend);
    expect(result.cohortCount).toBe(3);
    expect(result.rate).toBeCloseTo((0.2 + 0.3 + 0.4) / 3, 6);
  });
});

describe("deriveNewMemberRate", () => {
  it("returns null when newMemberCount is null/undefined", () => {
    expect(deriveNewMemberRate(null, 100)).toBeNull();
    expect(deriveNewMemberRate(undefined, 100)).toBeNull();
  });

  it("returns null when totalMembers is 0", () => {
    expect(deriveNewMemberRate(5, 0)).toBeNull();
  });

  it("computes count / total", () => {
    expect(deriveNewMemberRate(20, 200)).toBeCloseTo(0.1, 6);
  });
});

describe("deriveRecoveryRate", () => {
  it("returns null when latest or prev missing", () => {
    expect(deriveRecoveryRate(undefined, { dormantCount: 5 })).toBeNull();
    expect(
      deriveRecoveryRate({ returnedMembers: 1 }, undefined),
    ).toBeNull();
  });

  it("returns null when returnedMembers null/undefined", () => {
    expect(
      deriveRecoveryRate({ returnedMembers: null }, { dormantCount: 5 }),
    ).toBeNull();
    expect(
      deriveRecoveryRate({ returnedMembers: undefined }, { dormantCount: 5 }),
    ).toBeNull();
  });

  it("returns null when prev dormantCount is 0", () => {
    expect(
      deriveRecoveryRate({ returnedMembers: 1 }, { dormantCount: 0 }),
    ).toBeNull();
  });

  it("computes returnedMembers / prev.dormantCount", () => {
    expect(
      deriveRecoveryRate({ returnedMembers: 3 }, { dormantCount: 10 }),
    ).toBeCloseTo(0.3, 6);
  });
});

describe("deriveRecoverySeries", () => {
  it("first element is always null (no prev)", () => {
    const result = deriveRecoverySeries([
      { returnedMembers: 5, dormantCount: 10 },
      { returnedMembers: 2, dormantCount: 8 },
    ]);
    expect(result[0]).toBeNull();
    expect(result[1]).toBeCloseTo(2 / 10, 6);
  });

  it("propagates null on missing fields or zero prev", () => {
    const result = deriveRecoverySeries([
      { returnedMembers: 1, dormantCount: 10 }, // i=0 always null
      { returnedMembers: null, dormantCount: 5 }, // returnedMembers null
      { returnedMembers: 4, dormantCount: 0 }, // ok: prev=5, 4/5
      { returnedMembers: 3, dormantCount: 10 }, // prev.dormantCount=0 → null
    ]);
    expect(result[0]).toBeNull();
    expect(result[1]).toBeNull();
    expect(result[2]).toBeCloseTo(4 / 5, 6);
    expect(result[3]).toBeNull();
  });
});

describe("isRegularOverHabitual", () => {
  it("returns false when habitual is 0", () => {
    expect(isRegularOverHabitual(0, 5)).toBe(false);
  });

  it("returns false when regular <= habitual", () => {
    expect(isRegularOverHabitual(5, 5)).toBe(false);
    expect(isRegularOverHabitual(5, 3)).toBe(false);
  });

  it("returns true when 0 < habitual < regular", () => {
    expect(isRegularOverHabitual(3, 5)).toBe(true);
  });
});

describe("deriveSentCount", () => {
  it("returns totalMembers - latentCount", () => {
    expect(deriveSentCount(100, 30)).toBe(70);
  });

  it("clamps to 0 when latent exceeds total", () => {
    expect(deriveSentCount(50, 100)).toBe(0);
  });
});

describe("countContinuingSenders", () => {
  it("counts users with donationOutMonths >= threshold", () => {
    expect(FUNNEL_CONTINUING_MIN_MONTHS).toBe(2);
    const users = [
      { donationOutMonths: 0 },
      { donationOutMonths: 1 },
      { donationOutMonths: 2 },
      { donationOutMonths: 3 },
    ];
    expect(countContinuingSenders(users)).toBe(2);
  });
});

describe("deriveTenuredRatioFromMemberList", () => {
  it("returns null on empty users", () => {
    expect(deriveTenuredRatioFromMemberList([])).toBeNull();
  });

  it("uses default TENURE_THRESHOLD_DAYS", () => {
    expect(TENURE_THRESHOLD_DAYS).toBe(90);
    const users = [
      { daysIn: 30 },
      { daysIn: 60 },
      { daysIn: 90 },
      { daysIn: 200 },
    ];
    expect(deriveTenuredRatioFromMemberList(users)).toBeCloseTo(0.5, 6);
  });

  it("accepts custom threshold", () => {
    const users = [{ daysIn: 30 }, { daysIn: 200 }];
    expect(deriveTenuredRatioFromMemberList(users, 100)).toBeCloseTo(0.5, 6);
  });
});
