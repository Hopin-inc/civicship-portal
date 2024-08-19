import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
// import { registerApolloClient } from "@apollo/experimental-nextjs-app-support";

const link = createHttpLink({
  uri: process.env.API_ENDPOINT,
  // credentials: "same-origin",
});

// export const { getClient } = registerApolloClient(
//   () =>
//     new ApolloClient({
//       link,
//       ssrMode: true,
//       cache: new InMemoryCache(),
//     }),
// );

export const makeApolloClient = () => {
  return new ApolloClient({
    link,
    ssrMode: true,
    cache: new InMemoryCache(),
  });
}
