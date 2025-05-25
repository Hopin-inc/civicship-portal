import { Metadata } from "next";
import { apolloClient } from "@/lib/apollo";
import {
  GetPlaceDocument,
  GqlGetPlaceQuery,
  GqlGetPlaceQueryVariables,
  GqlPlace,
} from "@/types/graphql";
import { presenterPlaceDetail } from "@/app/places/data/presenter";
import { fallbackMetadata } from "@/lib/metadata/notFound";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/metadata/defalut";

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const id = params.id;
  const place = await fetchPlace(id);
  if (!place) return fallbackMetadata;

  const placeDetail = presenterPlaceDetail(place);

  return {
    title: `${placeDetail.name} | NEO四国88祭`,
    description: placeDetail.bio,
    openGraph: {
      title: placeDetail.name,
      description: placeDetail.bio,
      type: "article",
      url: `https://www.neo88.app/places/${id}`,
      images: placeDetail.images.length
        ? placeDetail.images.map((url) => ({
            url,
            width: 1200,
            height: 630,
            alt: placeDetail.name,
          }))
        : DEFAULT_OPEN_GRAPH_IMAGE,
    },
    alternates: {
      canonical: `https://www.neo88.app/places/${id}`,
    },
  };
};

async function fetchPlace(id: string): Promise<GqlPlace | null> {
  const { data } = await apolloClient.query<GqlGetPlaceQuery, GqlGetPlaceQueryVariables>({
    query: GetPlaceDocument,
    variables: { id },
  });

  return data.place ?? null;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
