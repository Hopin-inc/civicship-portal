import dayjs from "dayjs";
import { GqlRole, GqlVoteTopicPhase } from "@/types/graphql";
import { VoteListItem } from "../types/VoteListItem";

/**
 * 固定日時（ビジュアルリグレッション差分を減らす）
 */
export const STORYBOOK_LIST_DATE = "2026-05-01";

const base = dayjs(STORYBOOK_LIST_DATE);

export const mockUpcomingMembershipItem: VoteListItem = {
  id: "vote-upcoming-member",
  title: "次の地域イベントは何にする？",
  startsAt: base.add(2, "day").hour(9).minute(0).toDate(),
  endsAt: base.add(9, "day").hour(18).minute(0).toDate(),
  phase: GqlVoteTopicPhase.Upcoming,
  optionCount: 3,
  gateSummary: { type: "membership", requiredRole: GqlRole.Member },
  powerPolicySummary: { type: "flat" },
};

export const mockOpenNftItem: VoteListItem = {
  id: "vote-open-nft",
  title: "春祭りの開催日を決めよう",
  startsAt: base.subtract(1, "day").hour(9).minute(0).toDate(),
  endsAt: base.add(3, "day").hour(18).minute(0).toDate(),
  phase: GqlVoteTopicPhase.Open,
  optionCount: 4,
  gateSummary: { type: "nft", tokenName: "コミュニティパス" },
  powerPolicySummary: { type: "nftCount", tokenName: "コミュニティパス" },
};

export const mockClosedOwnerItem: VoteListItem = {
  id: "vote-closed-owner",
  title: "コミュニティ方針の重要な決定",
  startsAt: base.subtract(10, "day").hour(9).minute(0).toDate(),
  endsAt: base.subtract(3, "day").hour(18).minute(0).toDate(),
  phase: GqlVoteTopicPhase.Closed,
  optionCount: 2,
  gateSummary: { type: "membership", requiredRole: GqlRole.Owner },
  powerPolicySummary: { type: "flat" },
};

export const mockUpcomingLongTitleItem: VoteListItem = {
  id: "vote-long-title",
  title:
    "地域活性化プロジェクトの来年度予算配分について、関係者全員の意見を集めるための投票",
  startsAt: base.add(5, "day").hour(9).minute(0).toDate(),
  endsAt: base.add(12, "day").hour(18).minute(0).toDate(),
  phase: GqlVoteTopicPhase.Upcoming,
  optionCount: 5,
  gateSummary: { type: "membership", requiredRole: GqlRole.Manager },
  powerPolicySummary: { type: "flat" },
};

export const mockOpenNftNoNameItem: VoteListItem = {
  id: "vote-open-nft-noname",
  title: "トークン名が未設定のケース",
  startsAt: base.subtract(1, "day").hour(9).minute(0).toDate(),
  endsAt: base.add(3, "day").hour(18).minute(0).toDate(),
  phase: GqlVoteTopicPhase.Open,
  optionCount: 2,
  gateSummary: { type: "nft", tokenName: null },
  powerPolicySummary: { type: "nftCount", tokenName: null },
};

export const mockVoteListItems: VoteListItem[] = [
  mockUpcomingMembershipItem,
  mockOpenNftItem,
  mockClosedOwnerItem,
  mockUpcomingLongTitleItem,
  mockOpenNftNoNameItem,
];
