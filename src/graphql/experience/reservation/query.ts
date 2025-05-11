import { gql } from "@apollo/client";
import { RESERVATION_FRAGMENT } from "@/graphql/experience/reservation/fragment";
import { SLOT_FRAGMENT } from "@/graphql/experience/opportunitySlot/fragment";
import { PARTICIPATION_FRAGMENT } from "@/graphql/experience/participation/fragment";
import { OPPORTUNITY_FRAGMENT } from "@/graphql/experience/opportunity/fragment";
import { PLACE_FRAGMENT } from "@/graphql/location/place/fragment";
import { USER_FRAGMENT } from "@/graphql/account/user/fragment";
import { ARTICLE_FRAGMENT } from "@/graphql/content/article/fragment";

export const GET_RESERVATIONS = gql`
  query GetReservations {
    reservations {
      edges {
        node {
          id
        }
      }
      totalCount
    }
  }
`;

export const GET_RESERVATION = gql`
  query GetReservation($id: ID!) {
    reservation(id: $id) {
      ...ReservationFields
      opportunitySlot {
        ...OpportunitySlotFields
        opportunity {
          ...OpportunityFields
          createdByUser {
            ...UserFields
            articlesAboutMe {
              ...ArticleFields
            }
          }
          place {
            ...PlaceFields
          }
        }
      }
      participations {
        ...ParticipationFields
      }
    }
  }
  ${RESERVATION_FRAGMENT}
  ${SLOT_FRAGMENT}
  ${OPPORTUNITY_FRAGMENT}
  ${PLACE_FRAGMENT}
  ${USER_FRAGMENT}
  ${ARTICLE_FRAGMENT}
  ${PARTICIPATION_FRAGMENT}
`;
