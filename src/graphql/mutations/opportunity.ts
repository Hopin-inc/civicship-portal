import { graphql } from "@/gql";

export const CREATE_OPPORTUNITY = graphql(`
  mutation opportunityCreate($input: OpportunityCreateInput!) {
    opportunityCreate(input: $input) {
      ...on OpportunityCreateSuccess {
        opportunity {
          id
          title
          description
          category
          startsAt
          endsAt
          pointsPerParticipation
          publishStatus
          community {
            id
            name
          }
          city {
            code
            name
          }
        }
      }
    }
  }
`);

export const UPDATE_OPPORTUNITY = graphql(`
  mutation opportunityEditContent($id: ID!, $input: OpportunityEditContentInput!) {
    opportunityEditContent(id: $id, input: $input) {
      ...on OpportunityEditContentSuccess {
        opportunity {
          id
          title
          description
          category
          startsAt
          endsAt
          pointsPerParticipation
          publishStatus
          community {
            id
            name
          }
          city {
            code
            name
          }
        }
      }
    }
  }
`);

export const DELETE_OPPORTUNITY = graphql(`
  mutation opportunityDelete($id: ID!) {
    opportunityDelete(id: $id) {
      ...on OpportunityDeleteSuccess {
        opportunityId
      }
    }
  }
`);