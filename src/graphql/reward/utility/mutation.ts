import { gql } from "@apollo/client";

export const CREATE_UTILITY = gql`
  mutation CreateUtility($input: UtilityCreateInput!) {
    utilityCreate(input: $input) {
      ... on UtilityCreateSuccess {
        utility {
          ...UtilityFields
        }
      }
    }
  }
`;
