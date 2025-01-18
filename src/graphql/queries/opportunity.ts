import { graphql } from "@/gql";

export const GET_OPPORTUNITIES = graphql(`
  query opportunities($filter: OpportunityFilterInput, $sort: OpportunitySortInput, $cursor: String, $first: Int) {
      opportunities(filter: $filter, sort: $sort, cursor: $cursor, first: $first) {
          edges {
              node {
                  id
                  title
                  description
                  category
                  requireApproval
                  pointsPerParticipation
                  publishStatus
                  startsAt
                  endsAt
                  createdByUser {
                      id
                      name
                  }
                  community {
                      id
                      name
                  }
                  city {
                      code
                      name
                  }
                  participations {
                      id
                      user {
                          id
                          name
                      }
                  }
              }
          }
          pageInfo {
              endCursor
              hasNextPage
          }
      }
  }
`);

export const GET_OPPORTUNITY = graphql(`
    query opportunity($id: ID!) {
        opportunity(id: $id) {
            id
            title
            description
            category
            requireApproval
            pointsPerParticipation
            publishStatus
            startsAt
            endsAt
            createdByUser {
                id
                name
            }
            community {
                id
                name
                city {
                    code
                    name
                    state {
                        code
                        name
                    }
                }
                wallets {
                    id
                    user {
                        id
                        name
                    }
                    currentPointView {
                        walletId
                        currentPoint
                    }
                }
            }
            city {
                code
                name
                state {
                    code
                    name
                }
            }
            participations {
                id
                user {
                    id
                    name
                }
            }
        }
    }
`);