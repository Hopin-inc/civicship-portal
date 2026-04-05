import { gql } from "@apollo/client";

export const COMMUNITY_CREATE = gql`
  mutation CommunityCreate($input: CommunityCreateInput!) {
    communityCreate(input: $input) {
      ... on CommunityCreateSuccess {
        community {
          id
          name
          image
          bio
          website
          pointName
          establishedAt
          config {
            lineConfig {
              accessToken
              channelId
              channelSecret
              liffBaseUrl
              liffId
            }
          }
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
