"use server";

import { headers } from "next/headers";
import { getMembershipListServer } from "@/lib/graphql/getMembershipListServer";
import { GqlMembershipFilterInput, GqlMembershipSortInput } from "@/types/graphql";

export async function queryMemberships({
  cursor,
  filter,
  sort,
  first,
  withWallets,
  withDidIssuanceRequests,
}: {
  cursor?: { userId: string; communityId: string };
  filter?: GqlMembershipFilterInput;
  sort?: GqlMembershipSortInput;
  first?: number;
  withWallets?: boolean;
  withDidIssuanceRequests?: boolean;
}) {
  // Get communityId from filter/cursor, or fallback to request headers (set by middleware)
  const headersList = await headers();
  const headerCommunityId = headersList.get("x-community-id") || undefined;
  const communityId = filter?.communityId ?? cursor?.communityId ?? headerCommunityId;

  return await getMembershipListServer(
    {
      cursor,
      filter,
      sort,
      first,
      withWallets,
      withDidIssuanceRequests,
    },
    communityId
  );
}
