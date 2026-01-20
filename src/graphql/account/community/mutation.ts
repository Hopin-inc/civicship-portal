import { gql } from "@apollo/client";

export const UPDATE_SIGNUP_BONUS_CONFIG = gql`
  mutation UpdateSignupBonusConfig($input: UpdateSignupBonusConfigInput!, $communityId: ID!) {
    updateSignupBonusConfig(input: $input, permission: { communityId: $communityId }) {
      bonusPoint
      isEnabled
      message
    }
  }
`;

export const SIGNUP_BONUS_RETRY = gql`
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
