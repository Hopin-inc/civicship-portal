import { graphql } from "@/gql";

export const GET_MEMBERSHIPS = graphql(`
    query memberships($filter: MembershipFilterInput, $sort: MembershipSortInput, $cursor: String, $first: Int) {
        memberships(filter: $filter, sort: $sort, cursor: $cursor, first: $first) {
            edges {
                node {
                    user {
                        id
                        name
                    }
                    community {
                        id
                        name
                        city {
                            code
                            name
                            state {
                                code
                                name
                            }
                        }
                    }
                    role
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`);

// Query: Membership
export const GET_MEMBERSHIP = graphql(`
    query membership($userId: ID!, $communityId: ID!) {
        membership(userId: $userId, communityId: $communityId) {
            user {
                id
                name
            }
            community {
                id
                name
                city {
                    code
                    name
                    state {
                        code
                        name
                    }
                }
            }
            role
        }
    }
`);
