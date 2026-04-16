import dayjs from "dayjs";
import { GqlRole, GqlVoteGateType, GqlVotePowerPolicyType } from "@/types/graphql";
import { NftTokenOption } from "../hooks/useNftTokens";
import { VoteTopicFormValues } from "../types/form";

/**
 * Storybook 用フィクスチャ。実コード（hooks/useVoteTopicEditor など）とは
 * 独立に、日付を固定値にしてビジュアルリグレッション差分を減らす。
 */
export const STORYBOOK_BASE_DATE = "2026-05-01";

export const mockNftTokens: NftTokenOption[] = [
  {
    id: "nft-local-coin",
    name: "ローカルコインNFT",
    address: "0x1111111111111111111111111111111111111111",
    symbol: "LCN",
  },
  {
    id: "nft-community-pass",
    name: "コミュニティパス",
    address: "0x2222222222222222222222222222222222222222",
    symbol: "CPS",
  },
  {
    id: "nft-no-name",
    name: null,
    address: "0x3333333333333333333333333333333333333333",
    symbol: null,
  },
];

export function makeDefaultFormValues(
  overrides: Partial<VoteTopicFormValues> = {},
): VoteTopicFormValues {
  const base = dayjs(STORYBOOK_BASE_DATE);
  return {
    title: "",
    description: "",
    startsAt: base.hour(9).minute(0).format("YYYY-MM-DDTHH:mm"),
    endsAt: base.add(7, "day").hour(18).minute(0).format("YYYY-MM-DDTHH:mm"),
    options: [{ label: "" }, { label: "" }],
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
  };
}
