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
  mutation UpdateSignupBonusConfig($input: UpdateSignupBonusConfigInput!, $communityId: ID!) {
    updateSignupBonusConfig(input: $input, permission: { communityId: $communityId }) {
      bonusPoint
      isEnabled
      message
    }
  }
`;

export const INCENTIVE_GRANT_RETRY = gql`
  mutation IncentiveGrantRetry($incentiveGrantId: ID!, $communityId: ID!) {
    incentiveGrantRetry(
      input: { incentiveGrantId: $incentiveGrantId }
      permission: { communityId: $communityId }
    ) {
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
  mutation UpdatePortalConfig($input: CommunityPortalConfigInput!, $communityId: String!) {
    updatePortalConfig(input: $input, permission: { communityId: $communityId }) {
      communityId
      title
      description
      shortDescription
      logoPath
      squareLogoPath
      faviconPrefix
    }
  }
`;
