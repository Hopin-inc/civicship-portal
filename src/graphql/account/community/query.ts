import { gql } from '@apollo/client';

export const GET_COMMUNITIES = gql`
  query GetCommunities {
    communities {
      edges {
        node {
          id
          name
        }
      }
      totalCount
    }
  }
`;

export const GET_COMMUNITY = gql`
  query GetCommunity($id: ID!) {
    community(id: $id) {
      id
      name
    }
  }
`;

export const GET_SIGNUP_BONUS_CONFIG = gql`
  query GetSignupBonusConfig($communityId: ID!) {
    community(id: $communityId) {
      id
      config {
        signupBonusConfig {
          bonusPoint
          isEnabled
          message
        }
      }
    }
  }
`;

export const GET_FAILED_SIGNUP_BONUSES = gql`
  query GetFailedSignupBonuses($communityId: ID!) {
    signupBonuses(
      communityId: $communityId
      filter: { status: FAILED }
      sort: { field: LAST_ATTEMPTED_AT, order: DESC }
    ) {
      id
      user {
        id
        name
        image
      }
      failureCode
      lastError
      attemptCount
      lastAttemptedAt
    }
  }
`; 