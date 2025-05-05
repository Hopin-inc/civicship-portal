import { useQuery } from "@apollo/client";
import { GET_OPPORTUNITY } from "../graphql/queries/opportunity";
import type { Opportunity as GraphQLOpportunity } from "../gql/graphql";
import type { Opportunity, Article, Participation } from "../types";
import { COMMUNITY_ID } from "@/utils";

interface UseOpportunityResult {
  opportunity: Opportunity | null;
  loading: boolean;
  error: Error | null;
}

const transformArticle = (node: any): Partial<Article> => ({
  id: node.id,
  title: node.title,
  description: node.introduction || "",
  thumbnail: node.thumbnail || null,
});

const transformOpportunity = (data: GraphQLOpportunity | null): Opportunity | null => {
  if (!data) return null;

  const transformOpportunityNode = (node: any): Opportunity => ({
    id: node.id,
    title: node.title,
    description: node.description,
    type: "EVENT",
    status: "open",
    communityId: data.community?.id || "",
    hostId: data.createdByUser?.id || "",
    startsAt: node.slots?.edges?.[0]?.node?.startsAt?.toString() || node.createdAt?.toString() || "",
    endsAt: node.slots?.edges?.[0]?.node?.endsAt?.toString() || node.createdAt?.toString() || "",
    createdAt: node.createdAt?.toString() || "",
    updatedAt: node.updatedAt?.toString() || "",
    host: {
      name: data.createdByUser?.name || "",
      image: data.createdByUser?.image || null,
      title: "",
      bio: "",
    },
    images: node.images || [],
    location: {
      name: "",
      address: "",
      isOnline: false,
    },
    community: data.community ? {
      id: data.community.id,
      title: data.community.name ?? "",
      description: "",
      icon: data.community.image ?? "",
    } : undefined,
    recommendedFor: [],
    capacity: node.capacity,
    pointsForComplete: node.pointsToEarn,
    participants: [],
    body: node.description,
    requireApproval: node.requireApproval,
    pointsRequired: node.pointsToEarn,
    feeRequired: node.feeRequired,
    slots: node.slots,
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
      title: data.community.name ?? "",
      description: "",
      icon: data.community.image ?? "",
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
          node: transformArticle(edge?.node)
        })) || []
      } : undefined,
      opportunitiesCreatedByMe: data.createdByUser.opportunitiesCreatedByMe ? {
        edges: data.createdByUser.opportunitiesCreatedByMe.edges
          ?.map(edge => edge?.node)
          .filter((node): node is NonNullable<typeof node> => node != null && node.id !== data.id)
          .map(transformOpportunityNode) || [],
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
            edges: edge.node.participations.edges?.map(pEdge => ({
              node: {
                id: pEdge?.node?.id || "",
                status: pEdge?.node?.status || "",
                user: {
                  id: pEdge?.node?.user?.id || "",
                  name: pEdge?.node?.user?.name || "",
                  image: pEdge?.node?.user?.image || null,
                }
              }
            })) || [],
          } : undefined,
        },
      })) || [],
    } : undefined,
    requiredUtilities: data.requiredUtilities?.map(utility => ({
      id: utility?.id || "",
    })) || undefined,
  };
};

export const useOpportunity = (id: string): UseOpportunityResult => {
  const { data, loading, error } = useQuery(GET_OPPORTUNITY, {
    variables: {
      id,
      permission: {
        communityId: COMMUNITY_ID
      }
    },
    skip: !id,
    onError: (error) => {
      console.error('Opportunity query error:', error);
    },
  });

  return {
    opportunity: data ? transformOpportunity(data.opportunity) : null,
    loading,
    error: error || null,
  };
};            