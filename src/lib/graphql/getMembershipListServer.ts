import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import {
  GqlMembershipFilterInput,
  GqlMembershipSortInput,
  GqlMembershipsConnection,
} from "@/types/graphql";
import { logger } from "@/lib/logging";
import { GET_MEMBERSHIP_LIST_SERVER_QUERY } from "@/graphql/account/membership/server";
import { hasServerSession, getServerCookieHeader } from "@/lib/auth/server/session";

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
  variables: GetMembershipListServerVariables,
  communityId?: string
): Promise<{
  connection: GqlMembershipsConnection | null;
}> {
  const hasSession = await hasServerSession();
  const cookieHeader = await getServerCookieHeader();

  if (!hasSession) {
    logger.debug("No session cookie found for SSR membership fetch");
    return {
      connection: null,
    };
  }

  try {
    const headers: Record<string, string> = cookieHeader ? { cookie: cookieHeader } : {};
    if (communityId) {
      headers["X-Community-Id"] = communityId;
    }

    const res = await executeServerGraphQLQuery<
      GetMembershipListServerResponse,
      GetMembershipListServerVariables
    >(
      GET_MEMBERSHIP_LIST_SERVER_QUERY,
      variables,
      headers
    );

    return {
      connection: res.memberships,
    };
  } catch (error) {
    logger.warn("⚠️ Failed to fetch membership list on server:", {
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    throw error;
  }
}
