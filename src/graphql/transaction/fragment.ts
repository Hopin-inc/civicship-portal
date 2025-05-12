import { gql } from "@apollo/client";

export const TRANSACTION_FRAGMENT = gql`
  fragment TransactionFields on Transaction {
    id
    reason

    fromPointChange
    toPointChange

    createdAt
  }
`; 