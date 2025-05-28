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
