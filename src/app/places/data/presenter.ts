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

export const presenterPlacePins = (edges: GqlPlaceEdge[]): IPlacePin[] => {
  return edges
    .map((edge) => edge.node)
    .filter((node): node is GqlPlace => !!node && node.latitude != null && node.longitude != null)
    .map((node) => ({
      id: node.id,
      image:
        node.opportunities?.length &&
        node.opportunities?.[0].images &&
        node.opportunities?.[0].images?.[0]
          ? node.opportunities?.[0].images?.[0]
          : PLACEHOLDER_IMAGE,
      host: extractFirstHostFromPlace(node.opportunities?.[0]?.createdByUser),
      latitude: Number(node.latitude),
      longitude: Number(node.longitude),
      address: node.address,
    }));
};

export const presenterPlacePin = (node: GqlPlace): IPlacePin => {
  return {
    id: node.id,
    image:
      node.opportunities?.length &&
      node.opportunities?.[0].images &&
      node.opportunities?.[0].images?.[0]
        ? node.opportunities?.[0].images?.[0]
        : PLACEHOLDER_IMAGE,
    host: extractFirstHostFromPlace(node.opportunities?.[0]?.createdByUser),
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

    const opportunity = place.opportunities?.[0];
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

// #NOTE 拠点に複数人の案内人の体験が掲載されている場合、意図しない順序で表示されている拠点のID（順序を逆にすることで簡易的に解決する）
const REVERSE_ORDER_PLACE_IDS = [
  "cmahru0gg001vs60nnkqrgugc", // 坂東商店guest room〜藍染めと宿〜 https://www.neo88.app/places/cmahru0gg001vs60nnkqrgugc
  "cmahrua5f001xs60n3vp4csom",
];

const getOrderedArray = <T>(array: T[] | null | undefined, shouldReverse: boolean): T[] => {
  if (!array) return [];
  return shouldReverse ? [...array].reverse() : array;
};

export const presenterPlaceDetail = (place: GqlPlace): IPlaceDetail => {
  const opportunity = place.opportunities?.[0];
  const user = opportunity?.createdByUser;

  const pin = presenterPlacePin(place);

  const isReverseOrder = REVERSE_ORDER_PLACE_IDS.includes(place.id);

  const opportunities = getOrderedArray(place.opportunities, isReverseOrder);
  const publicOpportunities = opportunities.filter(
    (o) => o.publishStatus === GqlPublishStatus.Public,
  );

  const currentlyHiringOpportunities = publicOpportunities.map(presenterActivityCard);

  const relatedArticles = getOrderedArray(
    getRelatedArticles(user, publicOpportunities),
    isReverseOrder,
  );

  const images = getOrderedArray(
    getPlaceImages(place.image, currentlyHiringOpportunities),
    isReverseOrder,
  );

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
