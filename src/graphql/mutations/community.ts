import { graphql } from "@/gql";

export const COMMUNITY_CREATE = graphql(`
    mutation communityCreate($input: CommunityCreateInput!) {
        communityCreate(input: $input) {
            ...on CommunityCreateSuccess {
                community {
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
                    }
                }
            }
        }
    }
`);

export const COMMUNITY_DELETE = graphql(`
    mutation communityDelete($id: ID!) {
        communityDelete(id: $id) {
            ...on CommunityDeleteSuccess {
                communityId
            }
        }
    }
`);

export const COMMUNITY_UPDATE_PROFILE = graphql(`
    mutation communityUpdateProfile($id: ID!, $input: CommunityUpdateProfileInput!) {
        communityUpdateProfile(id: $id, input: $input) {
            ...on CommunityUpdateProfileSuccess {
                community {
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
                    }
                }
            }
        }
    }
`);