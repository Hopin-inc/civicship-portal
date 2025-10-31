import { gql } from '@apollo/client';

export const UPDATE_MY_PROFILE = gql(`
  mutation UpdateMyProfile($input: UserUpdateProfileInput!, $permission: CheckIsSelfPermissionInput!) {
    userUpdateMyProfile(input: $input, permission: $permission) {
      ... on UserUpdateProfileSuccess {
        user {
          id
          name
          image
          bio
          currentPrefecture
          preferredLanguage
          urlFacebook
          urlInstagram
          urlX
          slug
        }
      }
    }
  }
`);
