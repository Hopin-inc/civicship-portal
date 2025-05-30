import { gql } from "@apollo/client";

export const GET_PLACES = gql`
  query GetPlaces(
    $filter: PlaceFilterInput
    $first: Int
    $cursor: String
    $sort: PlaceSortInput
    $IsCard: Boolean! = false
  ) {
    places(filter: $filter, sort: $sort, first: $first, cursor: $cursor) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      totalCount
      edges {
        cursor
        node {
          ...PlaceFields
          accumulatedParticipants @include(if: $IsCard)
          currentPublicOpportunityCount @include(if: $IsCard)
          opportunities {
            id
            images
            createdByUser {
              image
              articlesAboutMe @include(if: $IsCard) {
                title
                introduction
                thumbnail
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PLACE = gql`
  query GetPlace($id: ID!) {
    place(id: $id) {
      ...PlaceFields
      opportunities {
        ...OpportunityFields
        place {
          ...PlaceFields
        }
        createdByUser {
          ...UserFields
          articlesAboutMe {
            ...ArticleFields
          }
        }
        articles {
          ...ArticleFields
          relatedUsers {
            ...UserFields
          }
        }
      }
    }
  }
`;
