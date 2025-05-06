import { gql } from '@apollo/client';

export const GetUserWalletDocument = gql(`
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
