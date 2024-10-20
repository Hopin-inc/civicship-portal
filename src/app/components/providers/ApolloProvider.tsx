"use client";

import { ApolloProvider as ApolloClientProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apollo";
import Loading from "@/app/components/layout/Loading";
import { Suspense } from "react";

const ApolloProvider = ({ children }: React.PropsWithChildren) => {
  return <ApolloClientProvider client={apolloClient}>
    <Suspense fallback={<Loading />}>{children}</Suspense>
  </ApolloClientProvider>;
};

export default ApolloProvider;
