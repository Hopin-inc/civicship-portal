"use client";
import {
  GqlMembership,
  GqlMembershipParticipationLocation,
  GqlPublishStatus,
  GqlUser,
} from "@/types/graphql";
import { PlaceCard, PlaceDetail, PlacePin } from "@/types/place";
import { presenterActivityCard, presenterOpportunityHost } from "@/presenters/opportunity";
import { presenterArticleWithAuthor } from "@/presenters/article";

export const presenterPlacePin = (
  location: GqlMembershipParticipationLocation,
  hostImage: string | null | undefined,
): PlacePin => ({
  id: location.placeId,
  image: location.placeImage,
  hostImage: hostImage || "",
  latitude: Number(location.latitude),
  longitude: Number(location.longitude),
});

export const transformMembershipsToPlaces = (memberships: GqlMembership[]): PlaceCard[] => {
  const places: PlaceCard[] = [];
  const seen = new Set<string>();

  memberships.forEach((membership) => {
    const user = membership.user;
    if (!user) return;

    const host = presenterOpportunityHost(user);
    const hosted = membership.participationView?.hosted;
    const publicOpportunityCount = getPublicOpportunityCount(user);

    hosted?.geo.forEach((location) => {
      if (seen.has(location.placeId)) return;
      seen.add(location.placeId);

      const pin = presenterPlacePin(location, host.image);

      places.push({
        ...pin,
        name: location.placeName,
        address: location.address,
        headline: membership.headline || "",
        bio: membership.bio || "",
        publicOpportunityCount,
        participantCount: hosted.totalParticipantCount ?? 0,
      });
    });
  });

  return places;
};

export const calculateTotalPlaces = (memberships: GqlMembership[]): number => {
  return memberships.reduce((total, membership) => {
    const hostedCount = membership.participationView?.hosted.geo.length ?? 0;
    return total + hostedCount;
  }, 0);
};

export const presenterPlaceDetail = (membership: GqlMembership, placeId: string): PlaceDetail => {
  const user = membership.user;
  if (!user) throw new Error("membership.user is required");

  const host = presenterOpportunityHost(user);
  const hosted = membership.participationView?.hosted;
  const location = hosted?.geo.find((l) => l.placeId === placeId);
  if (!location) {
    throw new Error(`Place ${placeId} not found in membership.hosted.geo`);
  }

  const pin = presenterPlacePin(location, host.image);
  const opportunities = user.opportunitiesCreatedByMe || [];
  const publicOpportunities = opportunities.filter(
    (o) => o.publishStatus === GqlPublishStatus.Public,
  );

  const currentlyHiringOpportunities = publicOpportunities.map(presenterActivityCard);
  const relatedArticles = (user.articlesAboutMe || []).map(presenterArticleWithAuthor);

  const images = Array.from(
    new Set(
      [location.placeImage, ...currentlyHiringOpportunities.flatMap((o) => o.images)].filter(
        Boolean,
      ),
    ),
  );

  return {
    ...pin,
    name: location.placeName,
    address: location.address,
    headline: membership.headline || "",
    bio: membership.bio || "",
    publicOpportunityCount: publicOpportunities.length,
    participantCount: hosted?.totalParticipantCount ?? 0,

    images,
    totalImageCount: images.length,

    currentlyHiringOpportunities,
    relatedArticles,
  };
};

const getPublicOpportunityCount = (user: GqlUser): number => {
  return (
    user?.opportunitiesCreatedByMe?.filter((o) => o.publishStatus === GqlPublishStatus.Public)
      .length ?? 0
  );
};
