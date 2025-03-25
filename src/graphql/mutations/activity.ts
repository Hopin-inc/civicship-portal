// import { graphql } from "@/gql";

// export const CREATE_ACTIVITY = graphql(`
//   mutation activityCreate($input: ActivityCreateInput!) {
//     activityCreate(input: $input) {
//       ...on ActivityCreateSuccess {
//         activity {
//           id
//           description
//         }
//       }
//     }
//   }
// `);

// export const UPDATE_ACTIVITY = graphql(`
//   mutation activityUpdateContent($id: ID!, $input: ActivityUpdateContentInput!) {
//     activityUpdateContent(id: $id, input: $input) {
//       ...on ActivityUpdateContentSuccess {
//         activity {
//           id
//           description
//         }
//       }
//     }
//   }
// `);

// export const DELETE_ACTIVITY = graphql(`
//   mutation deleteActivity($id: ID!) {
//     activityDelete(id: $id) {
//       ... on ActivityDeleteSuccess {
//         activityId
//       }
//     }
//   }
// `);
