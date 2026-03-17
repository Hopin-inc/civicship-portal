import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import {
  GqlMembershipFilterInput,
  GqlMembershipSortInput,
  GqlMembershipsConnection,
} from "@/types/graphql";
import { logger } from "@/lib/logging";
import { GET_MEMBERSHIP_LIST_SERVER_QUERY } from "@/graphql/account/membership/server";
import { hasServerSession } from "@/lib/auth/server/session";

interface GetMembershipListServerVariables {
  first?: number;
  cursor?: { userId: string; communityId: string };
  filter?: GqlMembershipFilterInput;
  sort?: GqlMembershipSortInput;
  withWallets?: boolean;
  withDidIssuanceRequests?: boolean;
}

interface GetMembershipListServerResponse {
  memberships: GqlMembershipsConnection;
}

export async function getMembershipListServer(
  variables: GetMembershipListServerVariables
): Promise<{
  connection: GqlMembershipsConnection | null;
}> {
  const hasSession = await hasServerSession();

  if (!hasSession) {
    logger.debug("No session cookie found for SSR membership fetch");
    return {
      connection: null,
    };
  }

  try {
    const res = await executeServerGraphQLQuery<
      GetMembershipListServerResponse,
      GetMembershipListServerVariables
    >(GET_MEMBERSHIP_LIST_SERVER_QUERY, variables);

    return {
      connection: res.memberships,
    };
  } catch (error) {
    logger.warn("[getMembershipListServer] Failed to fetch membership list on server", {
      message: (error as Error).message,
      component: "getMembershipListServer",
    });
    // Graceful fallback: return null instead of throwing to avoid page errors
    return {
      connection: null,
    };
  }
}
