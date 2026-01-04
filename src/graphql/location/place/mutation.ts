import { gql } from "@apollo/client";

export const PLACE_CREATE = gql`
  mutation PlaceCreate($input: PlaceCreateInput!, $permission: CheckCommunityPermissionInput!) {
    placeCreate(input: $input, permission: $permission) {
      ... on PlaceCreateSuccess {
        place {
          id
          name
          address
          latitude
          longitude
          googlePlaceId
          isManual
          mapLocation
          image
          city {
            code
            name
            state {
              code
              countryCode
              name
            }
          }
          community {
            id
          }
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const PLACE_UPDATE = gql`
  mutation PlaceUpdate(
    $id: ID!
    $input: PlaceUpdateInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    placeUpdate(id: $id, input: $input, permission: $permission) {
      ... on PlaceUpdateSuccess {
        place {
          id
          name
          address
          latitude
          longitude
          googlePlaceId
          isManual
          mapLocation
          image
          city {
            code
            name
            state {
              code
              countryCode
              name
            }
          }
          updatedAt
        }
      }
    }
  }
`;

export const PLACE_DELETE = gql`
  mutation PlaceDelete($id: ID!, $permission: CheckCommunityPermissionInput!) {
    placeDelete(id: $id, permission: $permission) {
      ... on PlaceDeleteSuccess {
        id
      }
    }
  }
`;
