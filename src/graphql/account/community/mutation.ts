import { gql } from "@apollo/client";

export const UPDATE_SIGNUP_BONUS_CONFIG = gql`
  mutation UpdateSignupBonusConfig($input: UpdateSignupBonusConfigInput!) {
    updateSignupBonusConfig(input: $input) {
      bonusPoint
      isEnabled
      message
    }
  }
`;

export const SIGNUP_BONUS_RETRY = gql`
  mutation RetrySignupBonusGrant($grantId: ID!, $communityId: ID!) {
    signupBonusRetry(grantId: $grantId, permission: { communityId: $communityId }) {
      ... on SignupBonusRetryPayload {
        success
        transaction {
          id
        }
        error
      }
    }
  }
`;
