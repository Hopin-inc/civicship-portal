import { graphql } from "@/gql";

export const CREATE_UTILITY = graphql(`
    mutation utilityCreate($input: UtilityCreateInput!) {
        utilityCreate(input: $input) {
            ...on UtilityCreateSuccess {
                utility {
                    id
                    name
                    image
                    description
                    pointsRequired
                }
            }
        }
    }
`);

export const UPDATE_UTILITY = graphql(`
    mutation utilityUpdateInfo($id: ID!, $input: UtilityUpdateInfoInput!) {
        utilityUpdateInfo(id: $id, input: $input) {
            ...on UtilityUpdateInfoSuccess {
                utility {
                    id
                    name
                    image
                    description
                    pointsRequired
                }
            }
        }
    }
`);

export const DELETE_UTILITY = graphql(`
    mutation utilityDelete($id: ID!) {
        utilityDelete(id: $id) {
            ...on UtilityDeleteSuccess {
                utilityId
            }
        }
    }
`);

export const USE_UTILITY = graphql(`
    mutation utilityUse($id: ID!, $input: UtilityUseInput!) {
        utilityUse(id: $id, input: $input) {
            ...on UtilityUseSuccess {
                transaction {
                    id
                    reason
                    fromPointChange
                    fromWallet {
                        id
                        currentPointView {
                            currentPoint
                        }
                    }
                    toPointChange
                    toWallet {
                        id
                        user {
                            id
                            name
                            image
                        }
                        currentPointView {
                            currentPoint
                        }
                    }
                    utility {
                        id
                        name
                        image
                        description
                        pointsRequired
                    }
                }
            }
        }
    }
`);