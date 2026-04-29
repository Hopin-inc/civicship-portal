import { GqlVoteTopicPhase } from "@/types/graphql";

export interface UserVoteListItem {
  id: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  phase: GqlVoteTopicPhase;
  optionCount: number;
  myBallotLabel: string | null;
  isEligible: boolean;
}
