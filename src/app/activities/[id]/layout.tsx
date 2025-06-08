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
import { getCommunityMetadata, DEFAULT_COMMUNITY_METADATA } from "@/lib/metadata/communityMetadata";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const communityId = COMMUNITY_ID;
  const res = await fetchOpportunity(id, communityId);
  const communityMetadata = await getCommunityMetadata(communityId);

  if (!res) return fallbackMetadata;
  const description = res.description ?? res.body;

  const title = `${res.title} | ${communityMetadata.title}`;

  const openGraph = communityMetadata.openGraph ?? DEFAULT_COMMUNITY_METADATA.openGraph;
  const baseUrl = openGraph?.url ?? "https://portal.civicship.jp";
  const siteName = openGraph?.siteName ?? communityMetadata.title;
  const locale = openGraph?.locale ?? "ja_JP";
  const defaultImages = openGraph?.images ?? [];

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title: res.title,
      description,
      url: `${baseUrl}/activities/${id}`,
      siteName,
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
          : defaultImages,
      locale,
    },
    alternates: {
      canonical: `${communityMetadata.alternates?.canonical || baseUrl}/activities/${id}`,
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
