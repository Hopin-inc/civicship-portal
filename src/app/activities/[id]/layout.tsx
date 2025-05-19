import { Metadata } from "next";
import { COMMUNITY_ID, DEFAULT_OGP } from "@/utils";
import {
  GetOpportunityDocument,
  GqlGetOpportunityQuery,
  GqlGetOpportunityQueryVariables,
  GqlOpportunity,
} from "@/types/graphql";
import { apolloClient } from "@/lib/apollo";
import { fallbackMetadata } from "@/lib/metadata";

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  //TODO COMMUNITY_IDを動的にかえる
  const id = params.id;
  const res = await fetchOpportunity(id, COMMUNITY_ID);

  if (!res) return fallbackMetadata;

  return {
    title: res.title,
    description: res.description ?? res.body,
    openGraph: {
      title: res.title,
      description: res.description ?? res.body,
      images: [
        {
          url: res.images?.[0] ?? DEFAULT_OGP,
          width: 1200,
          height: 630,
          alt: res.title,
        },
      ],
    },
  };
};

async function fetchOpportunity(id: string, communityId: string): Promise<GqlOpportunity | null> {
  const { data } = await apolloClient.query<
    GqlGetOpportunityQuery,
    GqlGetOpportunityQueryVariables
  >({
    query: GetOpportunityDocument,
    variables: { id, permission: { communityId } },
  });

  return data.opportunity ?? null;
}
