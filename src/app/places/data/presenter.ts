import {
  GqlOpportunity,
  GqlPlace,
  GqlPlaceEdge,
  GqlPublishStatus,
  GqlUser,
  Maybe,
} from "@/types/graphql";
import { ActivityCard, OpportunityPlace } from "@/app/activities/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { IPlaceCard, IPlaceDetail, IPlaceHost, IPlacePin } from "@/app/places/data/type";
import { presenterArticleWithAuthor } from "@/app/articles/data/presenter";
import { presenterActivityCard } from "@/app/activities/data/presenter";
import { TArticleWithAuthor } from "@/app/articles/data/type";
import { getPrimaryOpportunity, orderOpportunities } from "@/app/places/data/hardOrder";

export const presenterPlacePins = (edges: GqlPlaceEdge[]): IPlacePin[] => {
  return edges
    .map((edge) => edge.node)
    .filter((node): node is GqlPlace => !!node && node.latitude != null && node.longitude != null)
    .map((node) => {
      //TODO neo88専用の並び替えハードコード
      const opportunity = getPrimaryOpportunity(node);
      return {
        id: node.id,
        image: opportunity?.images?.[0] ?? PLACEHOLDER_IMAGE,
        host: extractFirstHostFromPlace(opportunity?.createdByUser),
        latitude: Number(node.latitude),
        longitude: Number(node.longitude),
        address: node.address,
      };
    });
};

export const presenterPlacePin = (node: GqlPlace): IPlacePin => {
  //TODO neo88専用の並び替えハードコード
  const opportunity = getPrimaryOpportunity(node);

  return {
    id: node.id,
    image: opportunity?.images?.[0] ?? PLACEHOLDER_IMAGE,
    host: extractFirstHostFromPlace(opportunity?.createdByUser),
    latitude: Number(node.latitude),
    longitude: Number(node.longitude),
    address: node.address,
  };
};

export const presenterPlaceCard = (edges: GqlPlaceEdge[]): IPlaceCard[] => {
  const places: IPlaceCard[] = [];

  edges.forEach((edge) => {
    const place = edge.node;
    if (!place || place.latitude == null || place.longitude == null) return;

    //TODO neo88専用の並び替えハードコード
    const opportunity = getPrimaryOpportunity(place);
    const user = opportunity?.createdByUser;

    const firstOpportunityOwnerWrittenArticle =
      user?.articlesAboutMe?.map(presenterArticleWithAuthor) ?? [];
    const pin = presenterPlacePin(place);

    places.push({
      ...pin,
      name: place.name,
      address: place.address,
      headline: firstOpportunityOwnerWrittenArticle[0]?.title || "",
      bio: firstOpportunityOwnerWrittenArticle[0]?.introduction || "",
      publicOpportunityCount: place.currentPublicOpportunityCount ?? 0,
      participantCount: place.accumulatedParticipants ?? 0,
      communityId: place.community?.id ?? "",
    });
  });

  return places;
};

export const presenterPlaceDetail = (place: GqlPlace): IPlaceDetail => {
  //TODO neo88専用の並び替えハードコード
  const orderedOpportunities = orderOpportunities(place.opportunities ?? [], place.id);
  const publicOpportunities = orderedOpportunities.filter(
    (o) => o.publishStatus === GqlPublishStatus.Public,
  );

  const currentlyHiringOpportunities = publicOpportunities.map(presenterActivityCard);

  const opportunity = orderedOpportunities[0];
  const user = opportunity?.createdByUser;

  const pin = presenterPlacePin(place);

  const relatedArticles = getRelatedArticles(user, publicOpportunities);
  const images = getPlaceImages(place.image, currentlyHiringOpportunities);

  return {
    ...pin,
    name: place.name,
    address: place.address,
    headline: relatedArticles[0]?.title || "Coming Soon!",
    bio: relatedArticles[0]?.introduction || "Coming Soon!",
    publicOpportunityCount: publicOpportunities.length,
    participantCount: place.accumulatedParticipants ?? 0,
    communityId: place.community?.id ?? "",
    images,
    totalImageCount: images.length,
    currentlyHiringOpportunities,
    relatedArticles,
  };
};

const getRelatedArticles = (
  user?: Maybe<GqlUser>,
  opportunities: GqlOpportunity[] = [],
): TArticleWithAuthor[] => {
  const profileArticles = user?.articlesAboutMe?.map(presenterArticleWithAuthor) ?? [];

  const opportunityArticles = opportunities.flatMap(
    (o) => o.articles?.map(presenterArticleWithAuthor) ?? [],
  );

  return Array.from(
    new Map([...profileArticles, ...opportunityArticles].map((a) => [a.id, a])).values(),
  );
};

const getPlaceImages = (
  placeImage?: string | null,
  opportunityCards: ActivityCard[] = [],
): string[] => {
  return Array.from(
    new Set(
      [placeImage, ...opportunityCards.flatMap((o) => o.images)].filter(
        (v): v is string => typeof v === "string",
      ),
    ),
  );
};

const extractFirstHostFromPlace = (host?: Maybe<GqlUser>): IPlaceHost => {
  return {
    id: host?.id ?? "",
    name: host?.name ?? "",
    image: host?.image ?? PLACEHOLDER_IMAGE,
    bio: host?.bio ?? "",
  };
};

export function presenterPlace(place?: Maybe<GqlPlace>): OpportunityPlace {
  return {
    id: place?.id || "",
    name: place?.name || "",
    description: "",
    address: place?.address || "",
    latitude: place?.latitude ?? undefined,
    longitude: place?.longitude ?? undefined,
  };
}
