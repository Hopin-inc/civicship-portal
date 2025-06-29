import { gql } from "@apollo/client";
import { SLOT_FRAGMENT } from "@/graphql/experience/opportunitySlot/fragment";
import { PARTICIPATION_FRAGMENT } from "@/graphql/experience/participation/fragment";
import { RESERVATION_FRAGMENT } from "@/graphql/experience/reservation/fragment";
import { OPPORTUNITY_FRAGMENT } from "@/graphql/experience/opportunity/fragment";
import { COMMUNITY_FRAGMENT } from "@/graphql/account/community/fragment";
import { PLACE_FRAGMENT } from "@/graphql/location/place/fragment";
import { USER_FRAGMENT } from "@/graphql/account/user/fragment";

// ★ filter引数を追加
export const GET_PARTICIPATIONS = gql`
  query GetParticipations($filter: ParticipationFilterInput) {
    participations(filter: $filter) {
      edges {
        node {
          id
          reason
          user {
            id
          }
          reservation {
            opportunitySlot {
              id
              reservations {
                createdByUser {
                  id
                }
              }
            }
          }
          opportunitySlot {
            id
            reservations {
              createdByUser {
                id
              }
            }
          }
          # 必要なら他のフィールドもここに追加
        }
      }
      totalCount
    }
  }
`;

export const GetParticipationDocument = gql(`
  query GetParticipation($id: ID!) {
    participation(id: $id) {
      ...ParticipationFields
      reservation {
        ...ReservationFields
        opportunitySlot {
          ...OpportunitySlotFields
          opportunity {
            ...OpportunityFields
            community {
              ...CommunityFields
            }
            createdByUser {
              ...UserFields
            }
            place {
              ...PlaceFields
            }
          }
        }
      }
      opportunitySlot {
        ...OpportunitySlotFields
        opportunity {
          ...OpportunityFields
          community {
            ...CommunityFields
          }
          createdByUser {
            ...UserFields
          }
          place {
            ...PlaceFields
          }
        }
      }
      evaluation {
        id
      }
      statusHistories {
        id
        status
        reason
        createdAt
        createdByUser {
          ...UserFields
        }
      }
      user {
        ...UserFields
      }
    }
  }
  ${PARTICIPATION_FRAGMENT}
  ${RESERVATION_FRAGMENT}
  ${OPPORTUNITY_FRAGMENT}
  ${SLOT_FRAGMENT}
  ${COMMUNITY_FRAGMENT}
  ${PLACE_FRAGMENT}
  ${USER_FRAGMENT}
`);