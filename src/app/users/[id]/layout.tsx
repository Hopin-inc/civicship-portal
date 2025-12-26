import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchUserServer } from "@/app/users/features/shared/server";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/communities/metadata";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/users/features/shared";
import { getCommunityConfig } from "@/lib/communities/getCommunityConfig";
import { headers, cookies } from "next/headers";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  // Get communityId from request headers (set by middleware) or cookies
  const headersList = await headers();
  const cookieStore = await cookies();
  const communityId = headersList.get("x-community-id") || cookieStore.get("communityId")?.value || "";
  
  const user = await fetchUserServer(id, communityId);
  
  // Fetch community config from database
  const communityConfig = await getCommunityConfig(communityId);
  
  const fallbackMetadata: Metadata = {
    title: communityConfig?.title || "",
    description: communityConfig?.description || "",
    openGraph: {
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
  };

  if (!user) return fallbackMetadata;

  return {
    title: `${user.name} | ${communityConfig?.title || ""}`,
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
  
  // Get communityId from request headers (set by middleware) or cookies
  const headersList = await headers();
  const cookieStore = await cookies();
  const communityId = headersList.get("x-community-id") || cookieStore.get("communityId")?.value || "";
  
  const gqlUser = await fetchUserServer(id, communityId);

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
