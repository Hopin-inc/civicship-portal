import { gql } from "@apollo/client";

export const PLACE_CREATE = gql`
  mutation PlaceCreate($input: PlaceCreateInput!, $permission: CheckCommunityPermissionInput!) {
    placeCreate(input: $input, permission: $permission) {
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
          id
          name
        }
        community {
          id
        }
        createdAt
        updatedAt
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
          id
          name
        }
        updatedAt
      }
    }
  }
`;

export const PLACE_DELETE = gql`
  mutation PlaceDelete($id: ID!, $permission: CheckCommunityPermissionInput!) {
    placeDelete(id: $id, permission: $permission) {
      placeId
    }
  }
`;
