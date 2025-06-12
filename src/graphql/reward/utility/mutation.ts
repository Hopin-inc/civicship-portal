import { gql } from "@apollo/client";

export const CREATE_UTILITY = gql`
  mutation CreateUtility($input: UtilityCreateInput!, $permission: CheckCommunityPermissionInput!) {
    utilityCreate(input: $input, permission: $permission) {
      ... on UtilityCreateSuccess {
        utility {
          ...UtilityFields
        }
      }
    }
  }
`;
