import { graphql } from "@/gql";

// Query: Users
export const GET_USERS = graphql(`
    query users($filter: UserFilterInput, $sort: UserSortInput, $cursor: String, $first: Int) {
        users(filter: $filter, sort: $sort, cursor: $cursor, first: $first) {
            edges {
                node {
                    id
                    name
                    slug
                    image
                    bio
                    memberships {
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
                    wallets {
                        id
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
                        currentPointView {
                            currentPoint
                        }
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

// Query: User
export const GET_USER = graphql(`
    query user($id: ID!) {
        user(id: $id) {
            id
            name
            slug
            image
            bio
            urlWebsite
            urlX
            urlFacebook
            urlInstagram
            urlYoutube
            urlTiktok
            createdAt
            updatedAt
            memberships {
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
            wallets {
                id
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
                currentPointView {
                    currentPoint
                }
            }
        }
    }
`);
