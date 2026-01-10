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
