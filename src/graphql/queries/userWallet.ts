import { graphql } from '../../gql/gql';

export const GetUserWalletDocument = graphql(`
  query GetUserWallet($userId: ID!) {
    user(id: $userId) {
      id
      wallets {
        edges {
          node {
            id
            currentPointView {
              currentPoint
            }
            tickets {
              edges {
                node {
                  id
                  utility {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`);
