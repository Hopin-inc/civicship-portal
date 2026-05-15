import { gql } from "@apollo/client";

export const COMMUNITY_CREATE = gql`
  mutation CommunityCreate($input: CommunityCreateInput!) {
    communityCreate(input: $input) {
      ... on CommunityCreateSuccess {
        community {
          id
          name
          image
        }
      }
    }
  }
`;

export const UPDATE_SIGNUP_BONUS_CONFIG = gql`
  mutation UpdateSignupBonusConfig($input: UpdateSignupBonusConfigInput!) {
    updateSignupBonusConfig(input: $input) {
      bonusPoint
      isEnabled
      message
    }
  }
`;

export const INCENTIVE_GRANT_RETRY = gql`
  mutation IncentiveGrantRetry($incentiveGrantId: ID!) {
    incentiveGrantRetry(input: { incentiveGrantId: $incentiveGrantId }) {
      ... on IncentiveGrantRetrySuccess {
        incentiveGrant {
          id
        }
        transaction {
          id
        }
      }
    }
  }
`;

export const UPDATE_PORTAL_CONFIG = gql`
  mutation UpdatePortalConfig($input: CommunityPortalConfigInput!) {
    updatePortalConfig(input: $input) {
      communityId
      title
      description
      shortDescription
      logoPath
      squareLogoPath
      ogImagePath
      faviconPrefix
    }
  }
`;
