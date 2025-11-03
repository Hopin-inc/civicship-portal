import {
  GqlAssignManagerMutation,
  GqlAssignMemberMutation,
  GqlAssignOwnerMutation,
  GqlErrorCode,
  useAssignManagerMutation,
  useAssignMemberMutation,
  useAssignOwnerMutation,
} from "@/types/graphql";
import { ApolloError } from "@apollo/client";
import { logger } from "@/lib/logging";

interface MembershipSetRoleInput {
  userId: string;
  communityId: string;
}

type Result =
  | {
      success: true;
      data: GqlAssignOwnerMutation | GqlAssignManagerMutation | GqlAssignMemberMutation;
    }
  | { success: false; code: GqlErrorCode };

export const useMembershipCommand = () => {
  const [assignOwnerMutation, { loading: loadingOwner }] = useAssignOwnerMutation();
  const [assignManagerMutation, { loading: loadingManager }] = useAssignManagerMutation();
  const [assignMemberMutation, { loading: loadingMember }] = useAssignMemberMutation();

  const createHandler = (
    mutationFn: Function,
  ): ((input: MembershipSetRoleInput) => Promise<Result>) => {
    return async (input) => {
      if (!input.userId || !input.communityId) {
        return { success: false, code: GqlErrorCode.ValidationError };
      }

      try {
        const { data } = await mutationFn({
          variables: {
            input,
            permission: { communityId: input.communityId },
          },
        });

        if (data) {
          return { success: true, data };
        } else {
          return { success: false, code: GqlErrorCode.Unknown };
        }
      } catch (e) {
        if (e instanceof ApolloError) {
          const gqlError = e.graphQLErrors[0];
          const code = gqlError?.extensions?.code as GqlErrorCode | undefined;
          return { success: false, code: code ?? GqlErrorCode.Unknown };
        }
        logger.warn("Mutation failed", {
          error: e instanceof Error ? e.message : String(e),
          component: "useMembershipMutations"
        });
        return { success: false, code: GqlErrorCode.Unknown };
      }
    };
  };

  return {
    assignOwner: createHandler(assignOwnerMutation),
    assignManager: createHandler(assignManagerMutation),
    assignMember: createHandler(assignMemberMutation),
    isLoading: loadingOwner || loadingManager || loadingMember,
  };
};
