import { graphql } from '@/gql/gql';

export const WalletTransactionsDocument = graphql(`
  query WalletTransactions($filter: TransactionFilterInput) {
    transactions(
      filter: $filter,
      sort: { createdAt: desc }
    ) {
      edges {
        node {
          id
          createdAt
          fromPointChange
          toPointChange
          reason
          fromWallet {
            id
            user {
              id
              name
            }
          }
          toWallet {
            id
            user {
              id
              name
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`); 