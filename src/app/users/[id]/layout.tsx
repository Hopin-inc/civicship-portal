import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPublicUserServer } from "@/app/users/features/shared/server";
import { currentCommunityConfig, DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/communities/metadata";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/users/features/shared";

type Props = {
  params: { id: string };
};

const fallbackMetadata: Metadata = {
  title: currentCommunityConfig.title,
  description: currentCommunityConfig.description,
  openGraph: {
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await fetchPublicUserServer(id);

  if (!user) return fallbackMetadata;

  return {
    title: `${user.name} | ${currentCommunityConfig.title}`,
    description: user.bio ?? "",
    openGraph: {
      type: "profile",
      title: user.name,
      description: user.bio ?? "",
      images: user.image
        ? [
            {
              url: user.image,
              width: 1200,
              height: 630,
              alt: user.name,
            },
          ]
        : DEFAULT_OPEN_GRAPH_IMAGE,
    },
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { id } = await params;
  const gqlUser = await fetchPublicUserServer(id);

  if (!gqlUser) {
    notFound();
  }

  const portfolios = (gqlUser.portfolios ?? []).map(mapGqlPortfolio);

  return (
    <UserProfileProvider
      value={{
        userId: gqlUser.id,
        isOwner: false,
        gqlUser,
        portfolios,
      }}
    >
      {children}
    </UserProfileProvider>
  );
}
