/**
 * サーバーサイド用のGraphQLクエリ実行ヘルパー関数
 */

export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: Array<string | number>;
  }>;
}

/**
 * サーバーサイドでGraphQLクエリを実行する関数
 */
export async function executeServerGraphQLQuery<
  TData = unknown,
  TVariables = Record<string, unknown>,
>(
  query: string,
  variables: TVariables,
  headers: Record<string, string> = {},
  options?: {
    tenantId?: string;
    communityId?: string;
  }
): Promise<TData> {
  const tenantId = options?.tenantId ?? process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID ?? "";
  const communityId = options?.communityId ?? process.env.NEXT_PUBLIC_COMMUNITY_ID ?? "";

  const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Mode": "session",
      "X-Civicship-Tenant": tenantId,
      "X-Community-Id": communityId,
      ...headers,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: GraphQLResponse<TData> = await response.json();

  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error(`GraphQL errors: ${result.errors.map((e) => e.message).join(", ")}`);
  }

  return result.data;
}
