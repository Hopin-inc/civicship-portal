// import { graphql } from "@/gql";

// export const GET_ACTIVITIES = graphql(`
//   query Activities($filter: ActivityFilterInput, $sort: ActivitySortInput) {
//     activities(filter: $filter, sort: $sort) {
//       edges {
//         node {
//           id
//           title
//           description
//           user {
//             id
//             name
//           }
//         }
//       }
//       pageInfo {
//         endCursor
//         hasNextPage
//       }
//     }
//   }
// `);

// export const GET_ACTIVITY = graphql(`
//   query Activity($id: ID!) {
//     activity(id: $id) {
//       id
//       title
//       description
//       user {
//         id
//         name
//       }
//     }
//   }
// `);
