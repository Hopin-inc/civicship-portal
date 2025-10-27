export const GET_MY_WALLET_SERVER_QUERY = `
  query GetMyWallet {
    myWallet {
      id
      type
      currentPointView {
        currentPoint
      }
      user {
        id
        name
        image
      }
      community {
        id
        name
      }
    }
  }
`;

export const GET_MEMBER_WALLETS_SERVER_QUERY = `
  query GetMemberWallets($filter: WalletFilterInput) {
    wallets(filter: $filter) {
      edges {
        node {
          id
          type
          currentPointView {
            currentPoint
          }
          community {
            id
          }
        }
      }
    }
  }
`;
