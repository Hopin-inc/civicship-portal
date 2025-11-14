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
  ssrFetched: boolean;
}> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value ?? null;

  if (!session) {
    logger.debug("No session cookie found for SSR membership fetch");
    return {
      connection: null,
      ssrFetched: false,
    };
  }

  try {
    const res = await executeServerGraphQLQuery<
      GetMembershipListServerResponse,
      GetMembershipListServerVariables
    >(
      GET_MEMBERSHIP_LIST_SERVER_QUERY,
      {
        first: variables.first,
        cursor: variables.cursor,
        filter: variables.filter,
        sort: variables.sort,
        withWallets: variables.withWallets ?? false,
        withDidIssuanceRequests: variables.withDidIssuanceRequests ?? false,
      },
      { Authorization: `Bearer ${session}` }
    );

    return {
      connection: res.memberships,
      ssrFetched: true,
    };
  } catch (error) {
    logger.warn("⚠️ Failed to fetch membership list on server:", {
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    return {
      connection: null,
      ssrFetched: false,
    };
  }
}
