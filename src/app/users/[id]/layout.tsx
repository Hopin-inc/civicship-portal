import { Metadata } from "next";
import {
  GetUserFlexibleDocument,
  GqlGetUserFlexibleQuery,
  GqlGetUserFlexibleQueryVariables,
  GqlUser,
} from "@/types/graphql";
import { apolloClient } from "@/lib/apollo";
import { fallbackMetadata, DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/communities/metadata";
import ProtectedLayout from '@/components/auth/ProtectedLayout';
import React from "react";

type Props = {
  params: { id: string };
};

export async function generateMetadata(input: Promise<Props>): Promise<Metadata> {
  const { params } = await input;
  const id = params.id;
  const res = await fetchUser(id);

  if (!res) return fallbackMetadata;

  return {
    title: res.name,
    description: res.bio ?? "",
    openGraph: {
      type: "profile",
      title: res.name,
      description: res.bio ?? "",
      images: res.image
        ? [
            {
              url: res.image,
              width: 1200,
              height: 630,
              alt: res.name,
            },
          ]
        : DEFAULT_OPEN_GRAPH_IMAGE,
    },
  };
}

async function fetchUser(id: string): Promise<GqlUser | null> {
  const { data } = await apolloClient.query<
    GqlGetUserFlexibleQuery,
    GqlGetUserFlexibleQueryVariables
  >({
    query: GetUserFlexibleDocument,
    variables: { id },
  });

  return data.user ?? null;
}

export default function Layout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <ProtectedLayout currentPath={`/users/${params.id}`}>
      {children}
    </ProtectedLayout>
  );
}
