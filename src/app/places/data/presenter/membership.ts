"use client";
import {
  GqlMembership,
  GqlMembershipParticipationLocation,
  GqlPublishStatus,
} from "@/types/graphql";
import { presenterArticleWithAuthor } from "@/app/articles/data/presenter";
import { OpportunityHost } from "@/app/activities/data/type";
import { BaseCardInfo, BaseDetail, BasePin } from "@/app/places/data/type";
import { presenterActivityCard, presenterOpportunityHost } from "@/app/activities/data/presenter";
import { PLACEHOLDER_IMAGE } from "@/utils";

export const presenterBasePins = (memberships: GqlMembership[]): BasePin[] => {
  const pins: BasePin[] = [];
  const seen = new Set<string>();

  for (const membership of memberships) {
    const hosted = membership.participationView?.hosted;
    const hostUser = membership.user;
    if (!hosted || !hostUser) continue;

    for (const location of hosted.geo ?? []) {
      const placeId = location?.placeId;
      if (!placeId || seen.has(placeId) || location.latitude == null || location.longitude == null)
        continue;

      seen.add(placeId);

      pins.push({
        id: placeId,
        image: location.placeImage ?? PLACEHOLDER_IMAGE,
        host: {
          id: hostUser.id,
          name: hostUser.name,
          image: hostUser.image ?? PLACEHOLDER_IMAGE,
          bio: hostUser.bio ?? "",
        },
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
        address: location.address ?? "",
      });
    }
  }

  return pins;
};

const presenterBasePin = (
  location: GqlMembershipParticipationLocation,
  host: OpportunityHost,
): BasePin => ({
  id: location.placeId,
  image: location.placeImage,
  host,
  latitude: Number(location.latitude),
  longitude: Number(location.longitude),
  address: location.address ?? "",
});

export const presenterBaseCard = (memberships: GqlMembership[]): BaseCardInfo[] => {
  const places: BaseCardInfo[] = [];
  const seen = new Set<string>();

  memberships.forEach((membership) => {
    const user = membership.user;
    if (!user) return;
    const relatedArticles = (user.articlesAboutMe || []).map(presenterArticleWithAuthor);
    const host = presenterOpportunityHost(user);
    const hosted = membership.participationView?.hosted;

    hosted?.geo.forEach((location) => {
      if (seen.has(location.placeId)) return;
      seen.add(location.placeId);

      const pin = presenterBasePin(location, host);

      places.push({
        ...pin,
        name: location.placeName,
        address: location.address,
        headline: relatedArticles?.[0]?.title || "",
        bio: relatedArticles?.[0]?.introduction || "",
        publicOpportunityCount: membership.hostOpportunityCount ?? 0,
        participantCount: hosted.totalParticipantCount ?? 0,
        communityId: membership.community?.id || "",
      });
    });
  });

  return places;
};

export const calculateTotalBases = (memberships: GqlMembership[]): number => {
  return memberships.reduce((total, membership) => {
    const hostedCount = membership.participationView?.hosted.geo.length ?? 0;
    return total + hostedCount;
  }, 0);
};

export const presenterBaseDetail = (membership: GqlMembership, placeId: string): BaseDetail => {
  const user = membership.user;
  if (!user) throw new Error("membership.user is required");

  const host = presenterOpportunityHost(user);
  const hosted = membership.participationView?.hosted;
  const location = hosted?.geo.find((l) => l.placeId === placeId);
  if (!location) {
    throw new Error(`Base ${placeId} not found in membership.hosted.geo`);
  }

  const pin = presenterBasePin(location, host);
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
    communityId: membership.community?.id || "",

    images,
    totalImageCount: images.length,

    currentlyHiringOpportunities,
    relatedArticles,
  };
};
