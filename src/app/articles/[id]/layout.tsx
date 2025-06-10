import { Metadata } from "next";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import {
  GetArticleDocument,
  GqlArticle,
  GqlGetArticleQuery,
  GqlGetArticleQueryVariables,
} from "@/types/graphql";
import { apolloClient } from "@/lib/apollo";
import { fallbackMetadata, DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/communities/metadata";
import React from "react";

type Props = {
  params: { id: string };
};

export async function generateMetadata(input: Promise<Props>): Promise<Metadata> {
  const { params } = await input;
  const id = params.id;
  const res = await fetchArticle(id, COMMUNITY_ID);

  if (!res) return fallbackMetadata;

  const description = res.introduction ?? res.body;

  return {
    title: res.title,
    description,
    openGraph: {
      type: "article",
      title: res.title,
      url: `https://www.neo88.app/articles/${id}`,
      description,
      images: res.thumbnail
        ? [
            {
              url: res.thumbnail,
              width: 1200,
              height: 630,
              alt: res.title,
            },
          ]
        : DEFAULT_OPEN_GRAPH_IMAGE,
    },
  };
}

async function fetchArticle(id: string, communityId: string): Promise<GqlArticle | null> {
  const { data } = await apolloClient.query<GqlGetArticleQuery, GqlGetArticleQueryVariables>({
    query: GetArticleDocument,
    variables: { id, permission: { communityId } },
  });

  return data.article ?? null;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
