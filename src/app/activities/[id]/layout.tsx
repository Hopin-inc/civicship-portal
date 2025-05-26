import { Metadata } from "next";
import { COMMUNITY_ID } from "@/utils";
import {
  GetOpportunityDocument,
  GqlGetOpportunityQuery,
  GqlGetOpportunityQueryVariables,
  GqlOpportunity,
} from "@/types/graphql";
import { apolloClient } from "@/lib/apollo";
import { fallbackMetadata } from "@/lib/metadata/notFound";
import React from "react";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/metadata/defalut";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const res = await fetchOpportunity(id, COMMUNITY_ID);

  if (!res) return fallbackMetadata;
  const description = res.description ?? res.body;

  return {
    title: `${res.title} | NEO四国88祭`,
    description,
    openGraph: {
      type: "article",
      title: res.title,
      description,
      url: `https://www.neo88.app/activities/${id}`,
      images:
        Array.isArray(res.images) && res.images.length > 0
          ? [
              {
                url: res.images[0],
                width: 1200,
                height: 630,
                alt: res.title,
              },
            ]
          : DEFAULT_OPEN_GRAPH_IMAGE,
    },
    alternates: {
      canonical: `https://www.neo88.app/activities/${id}`,
    },
  };
}

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

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
