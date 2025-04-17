import { gql } from '@apollo/client';

export const GET_MEMBERSHIPS = gql`
    query GetMemberships($first: Int, $cursor: MembershipCursorInput, $filter: MembershipFilterInput, $sort: MembershipSortInput) {
        memberships(first: $first, cursor: $cursor, filter: $filter, sort: $sort) {
            pageInfo {
                hasNextPage
                endCursor
            }
            edges {
                node {
                    bio
                    headline
                    participationView {
                        participated {
                            geo {
                                latitude
                                longitude
                                placeId
                                placeImage
                                placeName
                            }
                            totalParticipatedCount
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
                        image
                        name
                    }
                    role
                    status
                }
            }
        }
    }
`;