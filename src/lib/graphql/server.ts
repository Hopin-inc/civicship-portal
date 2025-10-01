import { cookies } from "next/headers";

export interface SessionData {
  accessToken: string | null;
  expiresAt: number;
  isVerified: boolean;
}

async function getSessionFromCookies(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("line_access_token")?.value || null;
  const expiresAt = cookieStore.get("line_expires_at")?.value
    ? parseInt(cookieStore.get("line_expires_at")!.value, 10)
    : 0;

  if (!accessToken) return null;
  if (expiresAt && Date.now() >= expiresAt) return null;

  return {
    accessToken,
    expiresAt,
    isVerified: true,
  };
}

async function buildAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return {};
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

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
  const sessionHeaders = await buildAuthHeaders();

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

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const result: GraphQLResponse<TData> = await response.json();
  if (result.errors) {
    throw new Error(`GraphQL errors: ${result.errors.map((e) => e.message).join(", ")}`);
  }
  return result.data;
}
