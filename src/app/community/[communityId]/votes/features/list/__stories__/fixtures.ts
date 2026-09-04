import dayjs from "dayjs";
import { GqlVoteTopicPhase } from "@/types/graphql";
import { UserVoteListItem } from "../types/UserVoteListItem";

const base = dayjs("2026-05-01");

export const mockOpenEligibleItem: UserVoteListItem = {
  id: "vote-open-eligible",
  title: "次の地域イベントは何にする？",
  startsAt: base.subtract(1, "day").hour(9).minute(0).toDate(),
  endsAt: base.add(3, "day").hour(18).minute(0).toDate(),
  phase: GqlVoteTopicPhase.Open,
  optionCount: 3,
  myBallotLabel: null,
  isEligible: true,
};

export const mockOpenVotedItem: UserVoteListItem = {
  id: "vote-open-voted",
  title: "春祭りの開催日を決めよう",
  startsAt: base.subtract(2, "day").hour(9).minute(0).toDate(),
  endsAt: base.add(5, "day").hour(18).minute(0).toDate(),
  phase: GqlVoteTopicPhase.Open,
  optionCount: 4,
  myBallotLabel: "5月3日（土）",
  isEligible: true,
};

export const mockOpenNotEligibleItem: UserVoteListItem = {
  id: "vote-open-not-eligible",
  title: "コミュニティパス保有者限定投票",
  startsAt: base.subtract(1, "day").hour(9).minute(0).toDate(),
  endsAt: base.add(3, "day").hour(18).minute(0).toDate(),
  phase: GqlVoteTopicPhase.Open,
  optionCount: 2,
  myBallotLabel: null,
  isEligible: false,
};

export const mockUpcomingItem: UserVoteListItem = {
  id: "vote-upcoming",
  title: "来月の活動方針を決める投票",
  startsAt: base.add(5, "day").hour(9).minute(0).toDate(),
  endsAt: base.add(12, "day").hour(18).minute(0).toDate(),
  phase: GqlVoteTopicPhase.Upcoming,
  optionCount: 5,
  myBallotLabel: null,
  isEligible: true,
};

export const mockClosedItem: UserVoteListItem = {
  id: "vote-closed",
  title: "コミュニティ方針の重要な決定",
  startsAt: base.subtract(10, "day").hour(9).minute(0).toDate(),
  endsAt: base.subtract(3, "day").hour(18).minute(0).toDate(),
  phase: GqlVoteTopicPhase.Closed,
  optionCount: 2,
  myBallotLabel: "賛成",
  isEligible: true,
};

export const mockUserVoteListItems: UserVoteListItem[] = [
  mockOpenEligibleItem,
  mockOpenVotedItem,
  mockOpenNotEligibleItem,
  mockUpcomingItem,
  mockClosedItem,
];
