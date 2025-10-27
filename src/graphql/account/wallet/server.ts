export const GET_CURRENT_USER_ID_SERVER_QUERY = `
  query GetCurrentUserId {
    currentUser {
      id
    }
  }
`;

export const GET_WALLET_BY_ID_SERVER_QUERY = `
  query GetWalletById($id: ID!) {
    wallet(id: $id) {
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
