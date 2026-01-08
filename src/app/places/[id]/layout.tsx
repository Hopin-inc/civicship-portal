import { Metadata } from "next";
import { apolloClient } from "@/lib/apollo";
import {
  GetPlaceDocument,
  GqlGetPlaceQuery,
  GqlGetPlaceQueryVariables,
  GqlPlace,
  GqlPublishStatus,
} from "@/types/graphql";
import { getCommunityConfig, getCommunityIdFromEnv } from "@/lib/communities/config";
import { DEFAULT_ASSET_PATHS } from "@/lib/communities/constants";

const DEFAULT_OPEN_GRAPH_IMAGE = [
  {
    url: DEFAULT_ASSET_PATHS.OG_IMAGE,
    width: 1200,
    height: 630,
    alt: "Civicship",
  },
];

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const id = params.id;
  const communityId = getCommunityIdFromEnv();
  const communityConfig = await getCommunityConfig(communityId);
  const place = await fetchPlace(id);
  
  const fallbackMetadata: Metadata = {
    title: communityConfig?.title ?? "Civicship",
    description: communityConfig?.description ?? "",
    openGraph: {
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
  };
  
  if (!place) return fallbackMetadata;

  const placeDetail = presenterPlaceDetailForMetadata(place);

  return {
    title: `${placeDetail.name} | ${communityConfig?.title ?? "Civicship"}`,
    description: placeDetail.bio,
    openGraph: {
      title: placeDetail.name,
      description: placeDetail.bio,
      type: "article",
      url: `${communityConfig?.domain ?? ""}/places/${id}`,
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
      canonical: `${communityConfig?.domain ?? ""}/places/${id}`,
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

const presenterPlaceDetailForMetadata = (place: GqlPlace) => {
  const opportunities = place.opportunities ?? [];
  const publicOpportunities = opportunities.filter(
    (o) => o.publishStatus === GqlPublishStatus.Public,
  );

  const firstArticle = place.opportunities
    ?.flatMap((o) => o.articles ?? [])
    ?.find((a) => !!a?.introduction); // クライアント関数を使わず article から直接取得

  const opportunityImages = publicOpportunities.flatMap((o) => o.images ?? []);

  const images = Array.from(
    new Set([place.image, ...opportunityImages].filter((v): v is string => typeof v === "string")),
  );

  return {
    name: place.name ?? "不明な場所",
    bio: firstArticle?.introduction ?? "Coming Soon!",
    images,
  };
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
