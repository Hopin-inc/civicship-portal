import { gql } from "@apollo/client";

export const PRODUCT_FIELDS = gql`
  fragment ProductFields on Product {
    id
    type
    name
    description
    imageUrl

    price
    maxSupply
    startsAt
    endsAt

    remainingSupply

    createdAt
    updatedAt
  }
`;
