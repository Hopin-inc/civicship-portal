"use server";

import { getMembershipListServer } from "@/lib/graphql/getMembershipListServer";
import { GqlMembershipFilterInput, GqlMembershipSortInput } from "@/types/graphql";

export async function queryMemberships({
  cursor,
  filter,
  sort,
  first,
  withWallets,
  withDidIssuanceRequests,
  communityId,
}: {
  cursor?: { userId: string; communityId: string };
  filter?: GqlMembershipFilterInput;
  sort?: GqlMembershipSortInput;
  first?: number;
  withWallets?: boolean;
  withDidIssuanceRequests?: boolean;
  communityId?: string;
}) {
  return await getMembershipListServer({
    cursor,
    filter,
    sort,
    first,
    withWallets,
    withDidIssuanceRequests,
    communityId,
  });
}
