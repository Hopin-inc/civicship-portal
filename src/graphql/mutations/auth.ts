import { graphql } from "@/gql";

export const CUSTOM_TOKEN_CREATE = graphql(`
  mutation createCustomToken($accessToken: String!, $platform: IdentityPlatform!) {
    customTokenCreateWithAccessToken(accessToken: $accessToken, platform: $platform) {
      idToken
    }
  }
`);
