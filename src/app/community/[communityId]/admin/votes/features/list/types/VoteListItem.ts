import { GqlRole, GqlVoteTopicPhase } from "@/types/graphql";

/**
 * 投票一覧アイテムの表示用 DTO。
 * GraphQL からの生データは `presentVoteList` で本型に変換する。
 */
export interface VoteListItem {
  id: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  phase: GqlVoteTopicPhase;
  optionCount: number;
  /** 「コミュニティメンバー」「NFT: XYZ」等、投票資格の短いサマリ */
  gateSummary: GateSummary;
  /** 「1 人 1 票」「NFT 保有数: XYZ」等 */
  powerPolicySummary: PowerPolicySummary;
}

export type GateSummary =
  | { type: "membership"; requiredRole: GqlRole }
  | { type: "nft"; tokenName: string | null };

export type PowerPolicySummary =
  | { type: "flat" }
  | { type: "nftCount"; tokenName: string | null };
