import { gql } from '@apollo/client';

export const GET_NFT_INSTANCES = gql`
  query GetNftInstances($first: Int, $cursor: String, $filter: NftInstanceFilterInput) {
    nftInstances(first: $first, cursor: $cursor, filter: $filter) {
      edges {
        cursor
        node {
          id
          instanceId
          name
          createdAt
          nftWallet {
          id
          walletAddress
          user {
            id
            name
            didIssuanceRequests {
              id
              status
              didValue
              requestedAt
              completedAt
            }
          }
        }
          description
          imageUrl
          nftToken {
            id
            address
            name
            symbol
            type
            createdAt
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_NFT_INSTANCE_WITH_DID = gql`
query GetNftInstanceWithDid($id: ID!) {
  nftInstance(id: $id) {
    id
    instanceId
    name
    description
    imageUrl
    json
    createdAt
    updatedAt
    nftToken {
      id
      address
      name
      symbol
      type
      json
    }
    nftWallet {
      id
      walletAddress
      user {
        id
        name
        didIssuanceRequests {
          id
          status
          didValue
          requestedAt
          processedAt
          completedAt
          createdAt
          updatedAt
        }
      }
    }
  }
}
`;