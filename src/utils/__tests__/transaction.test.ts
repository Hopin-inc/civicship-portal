import { describe, expect, it } from "vitest";
import { GqlTransactionReason } from "@/types/graphql";
import { mapReasonToAction } from "@/utils/transaction";

describe("mapReasonToAction", () => {
  it("CONTRIBUTION（コミュニティ財布への送付）は DONATION と同じ donation アクションにマップする", () => {
    expect(mapReasonToAction(GqlTransactionReason.Contribution)).toEqual({
      actionType: "donation",
    });
    // DONATION と完全に同じ扱いであることを固定する
    expect(mapReasonToAction(GqlTransactionReason.Contribution)).toEqual(
      mapReasonToAction(GqlTransactionReason.Donation),
    );
  });

  it("既存の DONATION マッピングは変わらない（後方互換）", () => {
    expect(mapReasonToAction(GqlTransactionReason.Donation)).toEqual({ actionType: "donation" });
  });
});
