import { Metadata } from "next";
import { COMMUNITY_ID } from "@/utils";
import {
  GetArticleDocument,
  GqlArticle,
  GqlGetArticleQuery,
  GqlGetArticleQueryVariables,
} from "@/types/graphql";
import { apolloClient } from "@/lib/apollo";
import { fallbackMetadata } from "@/lib/metadata/notFound";

export const generateMetadata = async (
  input: Promise<{ params: { id: string } }>,
): Promise<Metadata> => {
  //TODO COMMUNITY_IDを動的にかえる
  const { params } = await input;
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
          url: res.thumbnail ?? "",
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
