import { useQuery } from '@apollo/client';
import { GetParticipationDocument } from '@/graphql/queries/participation';
import type { GetParticipationQuery, GetParticipationQueryVariables } from '@/gql/graphql';
import type { Opportunity, Participation, Article } from '@/types';

export const useParticipation = (id: string) => {
  const { data, loading, error } = useQuery<GetParticipationQuery, GetParticipationQueryVariables>(
    GetParticipationDocument,
    {
      variables: { id },
      skip: !id,
    }
  );

  // Extract opportunity data from the participation
  const opportunityData = data?.participation?.reservation?.opportunitySlot?.opportunity;

  // Format opportunity data to match the Opportunity type
  const formattedOpportunity: Opportunity | undefined = opportunityData ? {
    id: opportunityData.id,
    title: opportunityData.title,
    description: opportunityData.description || "",
    type: opportunityData.category === 'EVENT' ? 'EVENT' : 'QUEST',
    status: opportunityData.publishStatus === 'PUBLIC' ? 'open' : 'closed',
    communityId: opportunityData.community?.id || "",
    hostId: opportunityData.createdByUser?.id || "",
    startsAt: opportunityData.slots?.edges?.[0]?.node?.startsAt || new Date(),
    endsAt: opportunityData.slots?.edges?.[0]?.node?.endsAt || new Date(),
    createdAt: opportunityData.createdAt,
    updatedAt: opportunityData.updatedAt || new Date(),
    host: {
      name: opportunityData.createdByUser?.name || "",
      image: opportunityData.createdByUser?.image || "",
      title: "",
      bio: "",
    },
    image: opportunityData.image || undefined,
    location: {
      name: opportunityData.place?.name || "",
      address: opportunityData.place?.address || "",
      isOnline: false,
      lat: opportunityData.place?.latitude || undefined,
      lng: opportunityData.place?.longitude || undefined,
    },
    community: opportunityData.community ? {
      id: opportunityData.community.id,
      title: opportunityData.community.name,
      description: "",
      icon: opportunityData.community.image || "",
    } : undefined,
    recommendedFor: [],
    capacity: opportunityData.capacity || 0,
    pointsForComplete: opportunityData.pointsToEarn || undefined,
    participants: opportunityData.slots?.edges?.[0]?.node?.participations?.edges?.map(edge => ({
      id: edge?.node?.user?.id || "",
      name: edge?.node?.user?.name || "",
      image: edge?.node?.user?.image || undefined,
    })) || [],
    body: opportunityData.body || undefined,
    createdByUser: opportunityData.createdByUser ? {
      id: opportunityData.createdByUser.id,
      name: opportunityData.createdByUser.name || "",
      image: opportunityData.createdByUser.image || undefined
    } : undefined,
    place: opportunityData.place ? {
      name: opportunityData.place.name || "",
      address: opportunityData.place.address || "",
      latitude: opportunityData.place.latitude || undefined,
      longitude: opportunityData.place.longitude || undefined,
    } : undefined,
    requireApproval: opportunityData.requireApproval || undefined,
    pointsRequired: opportunityData.pointsToEarn || undefined,
    feeRequired: opportunityData.feeRequired || undefined,
    slots: opportunityData.slots ? {
      edges: opportunityData.slots.edges?.map(edge => ({
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
                  image: pEdge?.node?.user?.image || undefined,
                },
              },
            })) || [],
          } : undefined,
        },
      })) || [],
    } : undefined,
  } : undefined;

  // Format participation data
  const formattedParticipation: Participation | undefined = data?.participation ? {
    node: {
      id: data.participation.id,
      status: data.participation.status,
      reason: data.participation.reason,
      images: data.participation.images || [],
      user: {
        id: data.participation.user?.id || "",
        name: data.participation.user?.name || "",
        image: data.participation.user?.image || undefined,
      },
      reservation: data.participation.reservation ? {
        id: data.participation.reservation.id,
        opportunitySlot: {
          id: data.participation.reservation.opportunitySlot.id,
          capacity: data.participation.reservation.opportunitySlot.capacity || 0,
          startsAt: data.participation.reservation.opportunitySlot.startsAt,
          endsAt: data.participation.reservation.opportunitySlot.endsAt,
          hostingStatus: data.participation.reservation.opportunitySlot.hostingStatus,
        },
        participations: data.participation.reservation.participations?.map(participation => ({
          id: participation.id,
          user: {
            id: participation.user?.id,
            name: participation.user?.name,
            image: participation.user?.image || undefined,
          }
        })) || [],
      } : undefined,
    },
  } : undefined;

  return {
    participation: formattedParticipation,
    opportunity: formattedOpportunity,
    loading,
    error,
  };
}; 