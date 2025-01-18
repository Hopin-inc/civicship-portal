import { graphql } from "@/gql";

// Query: Communities
export const GET_COMMUNITIES = graphql(`
    query communities($filter: CommunityFilterInput, $sort: CommunitySortInput, $cursor: String, $first: Int) {
        communities(filter: $filter, sort: $sort, cursor: $cursor, first: $first) {
            edges {
                node {
                    id
                    name
                    bio
                    image
                    state {
                        code
                        name
                    }
                    city {
                        code
                        name
                    }
                    memberships {
                        user {
                            id
                            name
                            image
                        }
                        role
                    }
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`);

// Query: Community
export const GET_COMMUNITY = graphql(`
    query community($id: ID!) {
        community(id: $id) {
            id
            name
            pointName
            image
            bio
            establishedAt
            website
            state {
                code
                name
            }
            city {
                code
                name
                state {
                    code
                    name
                }
            }
            memberships {
                user {
                    id
                    name
                }
                role
            }
            opportunities {
                id
                title
                description
                startsAt
                endsAt
            }
            participations {
                id
                user {
                    id
                    name
                }
                opportunity {
                    id
                    title
                }
            }
            wallets {
                id
                currentPointView {
                    currentPoint
                }
            }
            utilities {
                id
                name
                description
            }
        }
    }
`);
