import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import {
  GqlMembershipFilterInput,
  GqlMembershipSortInput,
  GqlMembershipsConnection,
} from "@/types/graphql";
import { cookies } from "next/headers";
import { logger } from "@/lib/logging";
import { GET_MEMBERSHIP_LIST_SERVER_QUERY } from "@/graphql/account/membership/server";

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
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  // Check for session cookie (support both "session" and "__session" names)
  if (!cookieHeader.includes("session=") && !cookieHeader.includes("__session=")) {
    logger.debug("No session cookie found for SSR membership fetch");
    return {
      connection: null,
    };
  }

  try {
    const res = await executeServerGraphQLQuery<
      GetMembershipListServerResponse,
      GetMembershipListServerVariables
    >(
      GET_MEMBERSHIP_LIST_SERVER_QUERY,
      variables,
      cookieHeader ? { cookie: cookieHeader } : {}
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
