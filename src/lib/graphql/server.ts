import { cookies } from "next/headers";
import { verifySession } from "@/app/(auth)/session";

export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
}

export async function executeServerGraphQLQuery<
  TData = unknown,
  TVariables = Record<string, unknown>,
>(query: string, variables: TVariables, headers: Record<string, string> = {}): Promise<TData> {
  let sessionHeaders: Record<string, string> = {};

  const result = await verifySession();
  if (result.success) {
    const cookieStore = await cookies();
    const lineAccessToken = cookieStore.get("line_access_token")?.value;
    if (lineAccessToken) {
      sessionHeaders.Authorization = `Bearer ${lineAccessToken}`;
    }
  }

  const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID!,
      "X-Community-Id": process.env.NEXT_PUBLIC_COMMUNITY_ID!,
      ...headers,
      ...sessionHeaders,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const resultData: GraphQLResponse<TData> = await response.json();
  if (resultData.errors) {
    console.error("GraphQL errors:", resultData.errors);
    throw new Error(`GraphQL errors: ${resultData.errors.map((e) => e.message).join(", ")}`);
  }

  return resultData.data;
}
