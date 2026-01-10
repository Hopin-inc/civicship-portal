import { gql } from '@apollo/client';

export const UPDATE_SIGNUP_BONUS_CONFIG = gql`
  mutation UpdateSignupBonusConfig($input: UpdateSignupBonusConfigInput!) {
    updateSignupBonusConfig(input: $input) {
      bonusPoint
      isEnabled
      message
    }
  }
`;

export const RETRY_SIGNUP_BONUS_GRANT = gql`
  mutation RetrySignupBonusGrant($grantId: ID!) {
    retrySignupBonusGrant(grantId: $grantId) {
      success
      error
      transaction {
        id
      }
    }
  }
`;
