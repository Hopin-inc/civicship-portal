import { GqlRole, GqlVoteTopicPhase } from "@/types/graphql";

export interface VoteDetailView {
  id: string;
  title: string;
  description: string | null;
  startsAt: Date;
  endsAt: Date;
  phase: GqlVoteTopicPhase;
  options: VoteDetailOption[];
  gate: VoteDetailGate;
  powerPolicy: VoteDetailPowerPolicy;
}

export interface VoteDetailOption {
  id: string;
  label: string;
  voteCount: number | null;
  totalPower: number | null;
}

export type VoteDetailGate =
  | { type: "membership"; requiredRole: GqlRole }
  | { type: "nft"; tokenName: string | null };

export type VoteDetailPowerPolicy =
  | { type: "flat" }
  | { type: "nftCount"; tokenName: string | null };
