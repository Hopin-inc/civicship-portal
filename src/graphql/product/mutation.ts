import { gql } from "@apollo/client";

export const BUY_PRODUCT = gql`
  mutation BuyProduct($productId: ID!) {
    productBuy(productId: $productId) {
      ... on ProductBuySuccess {
        paymentLink
      }
    }
  }
`;
