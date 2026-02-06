import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchUserServer } from "@/app/community/[communityId]/users/features/shared/server";
import { getCommunityConfig } from "@/lib/communities/config";
import { getCommunityIdFromHeader } from "@/lib/community/get-community-id-server";
import { DEFAULT_ASSET_PATHS } from "@/lib/communities/constants";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/community/[communityId]/users/features/shared";

type Props = {
  params: { id: string };
};

const DEFAULT_OPEN_GRAPH_IMAGE = [
  {
    url: DEFAULT_ASSET_PATHS.OG_IMAGE,
    width: 1200,
    height: 630,
    alt: "Civicship",
  },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const communityId = await getCommunityIdFromHeader();
  const communityConfig = communityId ? await getCommunityConfig(communityId) : null;
  const user = await fetchUserServer(id);

  const fallbackMetadata: Metadata = {
    title: communityConfig?.title ?? "Civicship",
    description: communityConfig?.description ?? "",
    openGraph: {
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
  };

  if (!user) return fallbackMetadata;

  return {
    title: `${user.name} | ${communityConfig?.title ?? "Civicship"}`,
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
  const gqlUser = await fetchUserServer(id);

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
