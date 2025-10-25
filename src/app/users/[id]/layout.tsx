import React from "react";
import { Metadata } from "next";
import { fetchPublicUserServer } from "@/app/users/features/shared/api/fetchPublicUserServer";
import { currentCommunityConfig, DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/communities/metadata";
import { presenterPortfolio } from "@/app/users/features/shared/mappers";
import { UserProfileProvider } from "@/app/users/features/shared/contexts/UserProfileContext";

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
  const { id } = params;
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
  const gqlUser = await fetchPublicUserServer(params.id);

  if (!gqlUser) {
    return <>{children}</>;
  }

  const portfolios = (gqlUser.portfolios ?? []).map(presenterPortfolio);

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
