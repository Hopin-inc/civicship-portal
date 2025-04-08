import { graphql } from "@/gql";

export const UPDATE_MY_PROFILE = graphql(`
  mutation UpdateMyProfile($input: UserUpdateProfileInput!, $permission: CheckIsSelfPermissionInput!) {
    userUpdateMyProfile(input: $input, permission: $permission) {
      ... on UserUpdateProfileSuccess {
        user {
          id
          name
          image
          bio
          currentPrefecture
          urlFacebook
          urlInstagram
          urlX
          slug
        }
      }
    }
  }
`);
