import { Metadata } from "next";
import { COMMUNITY_ID, DEFAULT_OGP } from "@/utils";
import {
  GetArticleDocument,
  GqlArticle,
  GqlGetArticleQuery,
  GqlGetArticleQueryVariables,
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
  const res = await fetchArticle(id, COMMUNITY_ID);

  if (!res) return fallbackMetadata;

  return {
    title: res.title,
    description: res.introduction ?? res.body,
    openGraph: {
      title: res.title,
      description: res.introduction ?? res.body,
      images: [
        {
          url: res.thumbnail ?? DEFAULT_OGP,
          width: 1200,
          height: 630,
          alt: res.title,
        },
      ],
    },
  };
};

async function fetchArticle(id: string, communityId: string): Promise<GqlArticle | null> {
  const { data } = await apolloClient.query<GqlGetArticleQuery, GqlGetArticleQueryVariables>({
    query: GetArticleDocument,
    variables: { id, permission: { communityId } },
  });

  return data.article ?? null;
}
