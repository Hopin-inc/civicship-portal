import { describe, expect, it } from "vitest";
import dayjs from "dayjs";
import { GqlRole, GqlVoteGateType, GqlVotePowerPolicyType } from "@/types/graphql";
import { createVoteTopicSchema } from "../schema";
import { VoteTopicFormValues } from "../../types/form";

// 翻訳キーをそのまま返すスタブ（メッセージ = キーで検証する）
const t = (key: string) => key;
const schema = createVoteTopicSchema(t);

const fmt = (d: ReturnType<typeof dayjs>) => d.format("YYYY-MM-DDTHH:mm");

const baseValues = (overrides: Partial<VoteTopicFormValues> = {}): VoteTopicFormValues => ({
  title: "テスト投票",
  description: "",
  startsAt: fmt(dayjs().add(1, "hour")),
  endsAt: fmt(dayjs().add(2, "hour")),
  options: [{ label: "A" }, { label: "B" }],
  gate: {
    type: GqlVoteGateType.Membership,
    requiredRole: GqlRole.Member,
    nftTokenId: null,
  },
  powerPolicy: {
    type: GqlVotePowerPolicyType.Flat,
    nftTokenId: null,
  },
  ...overrides,
});

const messagesFor = (values: VoteTopicFormValues) => {
  const result = schema.safeParse(values);
  return result.success ? [] : result.error.issues.map((i) => i.message);
};

describe("createVoteTopicSchema", () => {
  it("妥当な入力は通る", () => {
    expect(schema.safeParse(baseValues()).success).toBe(true);
  });

  it("開始日時が過去だと startsInPast エラー", () => {
    const values = baseValues({ startsAt: fmt(dayjs().subtract(1, "hour")) });
    expect(messagesFor(values)).toContain("adminVotes.form.errors.startsInPast");
  });

  it("開始日時が現在の分ちょうどは許可される", () => {
    const values = baseValues({ startsAt: fmt(dayjs()) });
    expect(messagesFor(values)).not.toContain("adminVotes.form.errors.startsInPast");
  });

  it("終了日時が開始以前だと endsAfterStart エラー", () => {
    const values = baseValues({
      startsAt: fmt(dayjs().add(2, "hour")),
      endsAt: fmt(dayjs().add(1, "hour")),
    });
    expect(messagesFor(values)).toContain("adminVotes.form.errors.endsAfterStart");
  });

  it("選択肢が2未満だと minTwoOptions エラー", () => {
    const values = baseValues({ options: [{ label: "A" }] });
    expect(messagesFor(values)).toContain("adminVotes.form.errors.minTwoOptions");
  });

  it("選択肢が重複すると duplicateOptionLabel エラー", () => {
    const values = baseValues({ options: [{ label: "A" }, { label: "A" }] });
    expect(messagesFor(values)).toContain("adminVotes.form.errors.duplicateOptionLabel");
  });
});
