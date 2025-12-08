import { gql } from "@apollo/client";
import { MEMBERSHIP_FRAGMENT } from "@/graphql/account/membership/fragment";

export const GET_CURRENT_USER = gql`
  query currentUser {
    currentUser {
      user {
        id
        name
        memberships {
          ...MembershipFields
          user {
            id
            name
            preferredLanguage
          }
          community {
            id
            name
          }
          role
          status
        }
      }
    }
  }
  ${MEMBERSHIP_FRAGMENT}
`;

export const GET_CURRENT_USER_SERVER = gql`
  query currentUserServer {
    currentUser {
      user {
        id
        name
        preferredLanguage
        identities {
          uid
          platform
        }
        memberships {
          ...MembershipFields
          user {
            id
            name
            preferredLanguage
          }
          community {
            id
            name
          }
          role
          status
        }
      }
    }
  }
  ${MEMBERSHIP_FRAGMENT}
`;
