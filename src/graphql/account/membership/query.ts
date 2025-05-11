import { gql } from '@apollo/client';

export const GET_SINGLE_MEMBERSHIP = gql`
  query GetSingleMembership($communityId: ID!, $userId: ID!) {
    membership(communityId: $communityId, userId: $userId) {
      bio
      headline
      role
      status
      reason
      createdAt
      updatedAt
      participationView {
        participated {
          totalParticipatedCount
          geo {
            latitude
            longitude
            placeId
            placeImage
            placeName
          }
        }
        hosted {
          totalParticipantCount
          geo {
            latitude
            longitude
            placeId
            placeImage
            placeName
          }
        }
      }
      user {
        id
        name
        image
        articlesAboutMe {
          id
          title
          introduction
          thumbnail
          createdAt
        }
        opportunitiesCreatedByMe {
          id
          title
          description
          category
          capacity
          community {
            id
            name
            image
          }
          pointsToEarn
          feeRequired
          requireApproval
          publishStatus
          images
          createdAt
          updatedAt
          slots {
            id
            startsAt
            endsAt
            reservations {
              participations {
                id
                status
                images
                user {
                  id
                  name
                  image
                }
              }
            }
          }
        }
      }
      community {
        id
        name
        image
      }
      histories {
        id
        status
        reason
        role
        createdAt
        createdByUser {
          id
          name
          image
        }
      }
    }
  }
`;

export const GET_MEMBERSHIP_LIST = gql`
  query GetMembershipList($first: Int, $cursor: MembershipCursorInput, $filter: MembershipFilterInput, $sort: MembershipSortInput) {
    memberships(first: $first, cursor: $cursor, filter: $filter, sort: $sort) {
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
      edges {
        node {
          bio
          headline
          role
          status
          reason
          createdAt
          updatedAt
          participationView {
            participated {
              totalParticipatedCount
              geo {
                latitude
                longitude
                placeId
                placeImage
                placeName
              }
            }
            hosted {
              totalParticipantCount
              geo {
                latitude
                longitude
                placeId
                placeImage
                placeName
              }
            }
          }
          user {
            id
            name
            image
            opportunitiesCreatedByMe {
              id
              title
              description
              category
              capacity
              community {
                id
                name
                image
              }
              pointsToEarn
              feeRequired
              requireApproval
              publishStatus
              images
              createdAt
              updatedAt
              slots {
                id
                startsAt
                endsAt
                reservations {
                  participations {
                    id
                    status
                    images
                    user {
                      id
                      name
                      image
                    }
                  }
                }
              }
            }
          }
          community {
            id
            name
            image
          }
        }
      }
    }
  }
`; 