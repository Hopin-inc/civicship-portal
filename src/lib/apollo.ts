import {
  ApolloClient,
  ApolloClientOptions, ApolloLink,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { cookies } from "next/headers";

const httpLink = createHttpLink({
  uri: process.env.API_ENDPOINT,
  credentials: "same-origin",
});
const requestLink = new ApolloLink((operation, forward) => {
  const accessToken = cookies().get("access_token")?.value;
  console.log("accessToken", accessToken);
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      "Authorization": accessToken ? `Bearer ${accessToken}` : "",
    },
  }));

  return forward(operation);
});
const link = ApolloLink.from([requestLink, httpLink]);

export const makeApolloClient = (options?: Partial<ApolloClientOptions<NormalizedCacheObject>>) => {
  return new ApolloClient({
    link,
    ssrMode: true,
    cache: new InMemoryCache({
      resultCaching: false,
    }),
    ...options ?? {},
  });
}
