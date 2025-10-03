import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GqlCurrentUserServerQuery, GqlCurrentUserServerQueryVariables } from "@/types/graphql";
import { cookies } from "next/headers";

export async function getUserServer() {
  const id = (await cookies()).get("user_id")?.value;
  if (!id) return null;

  const res = await executeServerGraphQLQuery<
    GqlCurrentUserServerQuery,
    GqlCurrentUserServerQueryVariables
  >(GET_CURRENT_USER_SERVER_QUERY, { id });
  console.log(res);
  return res.user ?? null;
}

const GET_CURRENT_USER_SERVER_QUERY = `
  query currentUserServer($id: ID!) {
    user(id: $id) {
      id
      name
      memberships {
        status
        role
        user { id name }
        community { id name }
      }
    }
  }
`;
