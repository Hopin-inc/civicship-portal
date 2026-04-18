import { GqlVoteTopicPhase } from "@/types/graphql";

export type DisplayMode = "upcoming" | "ineligible" | "cast" | "closed";

export interface VoteCastViewModel {
  topicId: string;
  title: string;
  description: string | null;
  startsAt: Date;
  endsAt: Date;
  phase: GqlVoteTopicPhase;
  displayMode: DisplayMode;
  options: { id: string; label: string }[];
  currentPower: number | null;
  myBallotOptionId: string | null;
  myBallotPower: number | null;
  myBallotLabel: string | null;
  reason: string | null;
}
