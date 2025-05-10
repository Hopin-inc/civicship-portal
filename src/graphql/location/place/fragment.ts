import { gql } from "@apollo/client";

export const PLACE_FRAGMENT = gql`
  fragment PlaceFields on Place {
    id
    name
    address
    latitude
    longitude
    city {
      name
      state {
        name
      }
    }
  }
`;