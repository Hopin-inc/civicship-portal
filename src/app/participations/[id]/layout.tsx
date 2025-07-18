import React from "react";
import { Metadata } from "next";
import { fallbackMetadata, DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/communities/metadata";
import {
  GetParticipationDocument,
  GqlGetParticipationQuery,
  GqlGetParticipationQueryVariables,
  GqlParticipation,
} from "@/types/graphql";
import { apolloClient } from "@/lib/apollo";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const res = await fetchParticipation(id);

  if (!res) return fallbackMetadata;

  const title = res.reservation?.opportunitySlot?.opportunity?.title;
  const description = res.reservation?.opportunitySlot?.opportunity?.description;
  const user = res.user?.name;

  return {
    title: `${title} | ${user}さんの関わり`,
    description,
    openGraph: {
      type: "article",
      title: `${title} | ${user}さんの関わり`,
      description,
      images: res.images?.[0]
        ? [
            {
              url: res.images[0],
              width: 1200,
              height: 630,
              alt: `${title} | ${user}さんの関わり`,
            },
          ]
        : DEFAULT_OPEN_GRAPH_IMAGE,
    },
  };
}

async function fetchParticipation(id: string): Promise<GqlParticipation | null> {
  const { data } = await apolloClient.query<
    GqlGetParticipationQuery,
    GqlGetParticipationQueryVariables
  >({
    query: GetParticipationDocument,
    variables: { id },
  });

  return data.participation ?? null;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
