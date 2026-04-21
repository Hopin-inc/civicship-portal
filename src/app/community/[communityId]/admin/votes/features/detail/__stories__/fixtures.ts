import dayjs from "dayjs";
import { GqlRole, GqlVoteTopicPhase } from "@/types/graphql";
import { VoteDetailView } from "../types/VoteDetailView";

const base = dayjs("2026-05-01");

export const mockUpcomingMembershipDetail: VoteDetailView = {
  id: "vote-upcoming-1",
  title: "次の地域イベントは何にする？",
  description:
    "5月の連休に開催する地域イベントの内容を投票で決めます。\nぜひ皆さんの意見を聞かせてください。",
  startsAt: base.add(2, "day").hour(9).minute(0).toDate(),
  endsAt: base.add(9, "day").hour(18).minute(0).toDate(),
  phase: GqlVoteTopicPhase.Upcoming,
  options: [
    { id: "opt-1", label: "地域の夏祭り", voteCount: null, totalPower: null },
    { id: "opt-2", label: "ハイキングイベント", voteCount: null, totalPower: null },
    { id: "opt-3", label: "フリーマーケット", voteCount: null, totalPower: null },
  ],
  gate: { type: "membership", requiredRole: GqlRole.Member },
  powerPolicy: { type: "flat" },
};

export const mockOpenNftDetail: VoteDetailView = {
  id: "vote-open-nft",
  title: "春祭りの開催日を決めよう",
  description: "コミュニティパス NFT を保有している方のみ投票できます。",
  startsAt: base.subtract(1, "day").hour(9).minute(0).toDate(),
  endsAt: base.add(3, "day").hour(18).minute(0).toDate(),
  phase: GqlVoteTopicPhase.Open,
  options: [
    { id: "opt-a", label: "5月3日（土）", voteCount: 12, totalPower: 28 },
    { id: "opt-b", label: "5月4日（日）", voteCount: 8, totalPower: 15 },
    { id: "opt-c", label: "5月5日（月祝）", voteCount: 5, totalPower: 10 },
    { id: "opt-d", label: "5月10日（土）", voteCount: 3, totalPower: 7 },
  ],
  gate: { type: "nft", tokenName: "コミュニティパス" },
  powerPolicy: { type: "nftCount", tokenName: "コミュニティパス" },
};

export const mockClosedOwnerDetail: VoteDetailView = {
  id: "vote-closed-owner",
  title: "コミュニティ方針の重要な決定",
  description: null,
  startsAt: base.subtract(10, "day").hour(9).minute(0).toDate(),
  endsAt: base.subtract(3, "day").hour(18).minute(0).toDate(),
  phase: GqlVoteTopicPhase.Closed,
  options: [
    { id: "opt-yes", label: "賛成", voteCount: 7, totalPower: 7 },
    { id: "opt-no", label: "反対", voteCount: 3, totalPower: 3 },
  ],
  gate: { type: "membership", requiredRole: GqlRole.Owner },
  powerPolicy: { type: "flat" },
};

export const mockManyOptionsDetail: VoteDetailView = {
  id: "vote-many-opts",
  title: "来年度の活動方針候補",
  description: "10 個の候補から投票してください。",
  startsAt: base.add(1, "day").hour(9).minute(0).toDate(),
  endsAt: base.add(14, "day").hour(18).minute(0).toDate(),
  phase: GqlVoteTopicPhase.Upcoming,
  options: Array.from({ length: 10 }, (_, i) => ({
    id: `opt-${i}`,
    label: `候補 ${i + 1}: ${"地域活性化ワークショップ防災訓練子ども食堂".slice(i, i + 6)}...`,
    voteCount: null,
    totalPower: null,
  })),
  gate: { type: "membership", requiredRole: GqlRole.Member },
  powerPolicy: { type: "flat" },
};
