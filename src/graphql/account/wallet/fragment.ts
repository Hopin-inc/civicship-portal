import { gql } from "@apollo/client";

export const WALLET_FRAGMENT = gql`
  fragment WalletFields on Wallet {
    id
    type
    createdAt
    updatedAt
  }
`; 