"use client";

import { ApolloProvider as ApolloClientProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apollo";

const ApolloProvider = ({ children }: React.PropsWithChildren) => {
  return <ApolloClientProvider client={apolloClient}>
    {children}
  </ApolloClientProvider>;
};

export default ApolloProvider;
