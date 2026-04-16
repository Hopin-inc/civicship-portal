import { GqlRole, GqlVoteGateType, GqlVotePowerPolicyType } from "@/types/graphql";

export type VoteOptionInput = { label: string };

export type VoteGateInput =
  | {
      type: typeof GqlVoteGateType.Membership;
      requiredRole: GqlRole;
      nftTokenId: null;
    }
  | {
      type: typeof GqlVoteGateType.Nft;
      requiredRole: null;
      nftTokenId: string;
    };

export type VotePowerPolicyInput =
  | {
      type: typeof GqlVotePowerPolicyType.Flat;
      nftTokenId: null;
    }
  | {
      type: typeof GqlVotePowerPolicyType.NftCount;
      nftTokenId: string;
    };

export type VoteTopicFormValues = {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  options: VoteOptionInput[];
  gate: VoteGateInput;
  powerPolicy: VotePowerPolicyInput;
};
