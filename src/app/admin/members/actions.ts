"use server";

import { getMembershipListServer } from "@/lib/graphql/getMembershipListServer";
import { GqlMembershipFilterInput, GqlMembershipSortInput } from "@/types/graphql";

export async function fetchMemberships({
  filter,
  sort,
  first,
  withWallets,
  withDidIssuanceRequests,
}: {
  filter?: GqlMembershipFilterInput;
  sort?: GqlMembershipSortInput;
  first?: number;
  withWallets?: boolean;
  withDidIssuanceRequests?: boolean;
}) {
  return await getMembershipListServer({
    filter,
    sort,
    first,
    withWallets,
    withDidIssuanceRequests,
  });
}

export async function fetchMoreMemberships({
  cursor,
  filter,
  sort,
  first,
  withWallets,
  withDidIssuanceRequests,
}: {
  cursor: { userId: string; communityId: string };
  filter?: GqlMembershipFilterInput;
  sort?: GqlMembershipSortInput;
  first?: number;
  withWallets?: boolean;
  withDidIssuanceRequests?: boolean;
}) {
  return await getMembershipListServer({
    cursor,
    filter,
    sort,
    first,
    withWallets,
    withDidIssuanceRequests,
  });
}
