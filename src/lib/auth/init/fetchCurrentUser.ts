import { CurrentUserServerDocument, GqlCurrentUserPayload } from "@/types/graphql";
import { apolloClient } from "@/lib/apollo";

export async function fetchCurrentUserClient(): Promise<GqlCurrentUserPayload["user"] | null> {
  const { data } = await apolloClient.query({
    query: CurrentUserServerDocument,
    fetchPolicy: "network-only",
  });
  return data?.currentUser?.user ?? null;
}
