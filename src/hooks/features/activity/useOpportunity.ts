import { useQuery } from "@apollo/client";
import { GET_OPPORTUNITY } from "@/graphql/queries/opportunity";
import type { Opportunity as GraphQLOpportunity } from "@/gql/graphql";
import type { Opportunity, Article, Participation } from "@/types";
import { COMMUNITY_ID } from "@/utils";

interface UseOpportunityResult {
  opportunity: Opportunity | null;
  loading: boolean;
  error: Error | null;
}

const transformArticle = (node: any): Partial<Article> => ({
  id: node?.id || "",
  title: node?.title || "",
  description: node?.introduction || "",
  introduction: node?.introduction || "",
  thumbnail: node?.thumbnail || null,
});

const transformOpportunityNode = (node: any, parent: GraphQLOpportunity): Opportunity => ({
  id: node?.id || "",
  title: node?.title || "",
  description: node?.description || "",
  type: "EVENT",
  status: "open",
  communityId: parent?.community?.id || "",
  hostId: parent?.createdByUser?.id || "",
  startsAt: node?.slots?.edges?.[0]?.node?.startsAt || node?.createdAt || "",
  endsAt: node?.slots?.edges?.[0]?.node?.endsAt || node?.createdAt || "",
  createdAt: node?.createdAt || "",
  updatedAt: node?.updatedAt || "",
  host: {
    name: parent?.createdByUser?.name || "",
    image: parent?.createdByUser?.image || null,
    title: "",
    bio: "",
  },
  images: node?.images || [],
  location: {
    name: "",
    address: "",
    isOnline: false,
  },
  community: parent?.community ? {
    id: parent.community.id,
    title: parent.community.name || "",
    description: "",
    icon: parent.community.image || "",
  } : undefined,
  recommendedFor: [],
  capacity: node?.capacity || 0,
  pointsForComplete: node?.pointsToEarn,
  participants: [],
  body: node?.description,
  requireApproval: node?.requireApproval,
  pointsRequired: node?.pointsToEarn,
  feeRequired: node?.feeRequired,
  slots: node?.slots || { edges: [] },
});

const transformParticipationNode = (pEdge: any): Participation => ({
  node: {
    id: pEdge?.node?.id || "",
    status: pEdge?.node?.status || "",
    reason: "",
    images: pEdge?.node?.images || [],
    user: {
      id: pEdge?.node?.user?.id || "",
      name: pEdge?.node?.user?.name || "",
      image: pEdge?.node?.user?.image || null,
    },
  },
});

const transformOpportunity = (data: GraphQLOpportunity | null): Opportunity | null => {
  if (!data) return null;

  try {
    return {
      id: data.id,
      title: data.title,
      description: data.description || "",
      type: "EVENT",
      status: "open",
      communityId: data.community?.id || "",
      hostId: data.createdByUser?.id || "",
      startsAt: data.slots?.edges?.[0]?.node?.startsAt || "",
      endsAt: data.slots?.edges?.[0]?.node?.endsAt || "",
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      host: {
        name: data.createdByUser?.name || "",
        image: data.createdByUser?.image || null,
        title: "",
        bio: "",
      },
      images: data.images || [],
      location: {
        name: data.place?.name || "",
        address: data.place?.address || "",
        isOnline: false,
        lat: data.place?.latitude || undefined,
        lng: data.place?.longitude || undefined,
      },
      community: data.community ? {
        id: data.community.id,
        title: data.community.name || "",
        description: "",
        icon: data.community.image || "",
      } : undefined,
      recommendedFor: [],
      capacity: data.capacity || 0,
      pointsForComplete: data.pointsToEarn || undefined,
      participants: data.slots?.edges?.[0]?.node?.participations?.edges?.map(edge => ({
        id: edge?.node?.user?.id || "",
        name: edge?.node?.user?.name || "",
        image: edge?.node?.user?.image || null,
      })) || [],
      body: data.body || undefined,
      createdByUser: data.createdByUser ? {
        id: data.createdByUser.id,
        name: data.createdByUser.name || "",
        image: data.createdByUser.image || null,
        articlesAboutMe: data.createdByUser.articlesAboutMe ? {
          edges: data.createdByUser.articlesAboutMe.edges?.map(edge => ({
            node: transformArticle(edge?.node),
          })) || [],
        } : undefined,
        opportunitiesCreatedByMe: data.createdByUser.opportunitiesCreatedByMe ? {
          edges: data.createdByUser.opportunitiesCreatedByMe.edges
            ?.map(edge => edge?.node)
            .filter((node): node is NonNullable<typeof node> => node != null && node.id !== data.id)
            .map(node => transformOpportunityNode(node, data)) || [],
        } : undefined,
      } : undefined,
      place: data.place ? {
        name: data.place.name || "",
        address: data.place.address || "",
        latitude: data.place.latitude || undefined,
        longitude: data.place.longitude || undefined,
      } : undefined,
      requireApproval: data.requireApproval || undefined,
      pointsRequired: data.pointsToEarn || undefined,
      feeRequired: data.feeRequired || undefined,
      slots: data.slots ? {
        edges: data.slots.edges?.map(edge => ({
          node: {
            id: edge?.node?.id || "",
            startsAt: edge?.node?.startsAt || "",
            endsAt: edge?.node?.endsAt || "",
            participations: edge?.node?.participations ? {
              edges: edge.node.participations.edges?.map(transformParticipationNode) || [],
            } : undefined,
          },
        })) || [],
      } : { edges: [] },
      requiredUtilities: data.requiredUtilities?.map(utility => ({
        id: utility?.id || "",
      })) || undefined,
    };
  } catch (e) {
    console.error("transformOpportunity failed", e);
    return null;
  }
};

export const useOpportunity = (id: string): UseOpportunityResult => {
  const isValidId = Boolean(id && id.trim());

  const { data, loading, error } = useQuery(GET_OPPORTUNITY, {
    variables: {
      id,
      permission: {
        communityId: COMMUNITY_ID,
      },
    },
    skip: !isValidId,
    fetchPolicy: "network-only",
    errorPolicy: "all",
    onError: (error) => {
      console.error("Opportunity query error:", error);
    },
  });

  const opportunity = isValidId && data?.opportunity
    ? transformOpportunity(data.opportunity)
    : null;

  return {
    opportunity,
    loading,
    error: error || null,
  };
};

