import { graphql } from "@/gql";

export const USER_UPDATE_PROFILE = graphql(`
    mutation userUpdateProfile($id: ID!, $input: UserUpdateProfileInput!) {
        userUpdateProfile(id: $id, input: $input) {
            ...on UserUpdateProfileSuccess {
                user {
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
                }
            }
        }
    }
`);