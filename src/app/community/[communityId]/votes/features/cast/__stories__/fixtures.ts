import dayjs from "dayjs";
import { GqlVoteTopicPhase } from "@/types/graphql";
import { VoteCastViewModel } from "../types/VoteCastViewModel";

const base = dayjs("2026-05-01");

export const mockUpcomingView: VoteCastViewModel = {
  topicId: "topic-upcoming",
  title: "次の地域イベントは何にする？",
  description: "5月の連休に開催する地域イベントの内容を投票で決めます。",
  startsAt: base.add(2, "day").hour(9).minute(0).toDate(),
  endsAt: base.add(9, "day").hour(18).minute(0).toDate(),
  phase: GqlVoteTopicPhase.Upcoming,
  displayMode: "upcoming",
  options: [
    { id: "opt-1", label: "地域の夏祭り", voteCount: null, totalPower: null },
    { id: "opt-2", label: "ハイキングイベント", voteCount: null, totalPower: null },
    { id: "opt-3", label: "フリーマーケット", voteCount: null, totalPower: null },
  ],
  currentPower: null,
  myBallotOptionId: null,
  myBallotPower: null,
  myBallotLabel: null,
  reason: null,
  gate: { type: "membership" as const, requiredRoleLabel: null, nftTokenName: null },
};

export const mockOpenIneligibleView: VoteCastViewModel = {
  ...mockUpcomingView,
  topicId: "topic-ineligible",
  phase: GqlVoteTopicPhase.Open,
  displayMode: "ineligible",
  startsAt: base.subtract(1, "day").toDate(),
  reason: "REQUIRED_NFT_NOT_FOUND",
  gate: { type: "nft", requiredRoleLabel: null, nftTokenName: "コミュニティパス" },
};

export const mockOpenEligibleNewView: VoteCastViewModel = {
  ...mockUpcomingView,
  topicId: "topic-new",
  phase: GqlVoteTopicPhase.Open,
  displayMode: "cast",
  startsAt: base.subtract(1, "day").toDate(),
  currentPower: 1,
};

export const mockOpenAlreadyVotedView: VoteCastViewModel = {
  ...mockUpcomingView,
  topicId: "topic-voted",
  phase: GqlVoteTopicPhase.Open,
  displayMode: "cast",
  startsAt: base.subtract(1, "day").toDate(),
  currentPower: 3,
  myBallotOptionId: "opt-1",
  myBallotPower: 3,
  myBallotLabel: "地域の夏祭り",
};

const closedOptions: VoteCastViewModel["options"] = [
  { id: "opt-1", label: "地域の夏祭り", voteCount: 12, totalPower: 12 },
  { id: "opt-2", label: "ハイキングイベント", voteCount: 8, totalPower: 8 },
  { id: "opt-3", label: "フリーマーケット", voteCount: 5, totalPower: 5 },
];

export const mockClosedNotVotedView: VoteCastViewModel = {
  ...mockUpcomingView,
  topicId: "topic-closed-notvoted",
  phase: GqlVoteTopicPhase.Closed,
  displayMode: "closed",
  startsAt: base.subtract(10, "day").toDate(),
  endsAt: base.subtract(3, "day").toDate(),
  options: closedOptions,
};

export const mockClosedVotedView: VoteCastViewModel = {
  ...mockUpcomingView,
  topicId: "topic-closed-voted",
  phase: GqlVoteTopicPhase.Closed,
  displayMode: "closed",
  startsAt: base.subtract(10, "day").toDate(),
  endsAt: base.subtract(3, "day").toDate(),
  options: closedOptions,
  myBallotOptionId: "opt-2",
  myBallotPower: 1,
  myBallotLabel: "ハイキングイベント",
};
