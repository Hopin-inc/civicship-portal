import { gql } from "@apollo/client";

export const TRANSACTION_FRAGMENT = gql`
  fragment TransactionFields on Transaction {
    id
    createdAt
    updatedAt
    fromPointChange
    toPointChange
    reason
  }
`; 