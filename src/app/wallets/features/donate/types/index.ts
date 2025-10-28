import { GqlUser } from "@/types/graphql";

export interface DonateMember {
  user: GqlUser;
  wallet: {
    currentPointView: {
      currentPoint: bigint;
    };
  };
}
