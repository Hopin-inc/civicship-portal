import { Metadata } from "next";
import {
  GetUserFlexibleDocument,
  GqlGetUserFlexibleQuery,
  GqlGetUserFlexibleQueryVariables,
  GqlUser,
} from "@/types/graphql";
import { apolloClient } from "@/lib/apollo";
import { fallbackMetadata } from "@/lib/metadata/notFound";

export const generateMetadata = async (
  input: Promise<{ params: { id: string } }>,
): Promise<Metadata> => {
  //TODO COMMUNITY_IDを動的にかえる
  const { params } = await input;
  const id = params.id;
  const res = await fetchUser(id);

  if (!res) return fallbackMetadata;

  return {
    title: res.name,
    description: res.bio,
    openGraph: {
      title: res.name,
      description: res.bio ?? "",
      images: [
        {
          url: res.image ?? "",
          width: 1200,
          height: 630,
          alt: res.name,
        },
      ],
    },
  };
};

async function fetchUser(id: string): Promise<GqlUser | null> {
  const { data } = await apolloClient.query<
    GqlGetUserFlexibleQuery,
    GqlGetUserFlexibleQueryVariables
  >({
    query: GetUserFlexibleDocument,
    variables: { id },
  });

  return data.user ?? null;
}
