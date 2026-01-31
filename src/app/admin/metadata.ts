// app/admin/metadata.ts
import { Metadata } from "next";
import { getCommunityConfig, getDefaultOgImage } from "@/lib/communities/config";
import { getCommunityIdFromHeader } from "@/lib/community/get-community-id-server";

export async function generateMetadata(): Promise<Metadata> {
  const communityId = await getCommunityIdFromHeader();
  const config = communityId ? await getCommunityConfig(communityId) : null;

  const title = config?.title || "";
  const ogImages = getDefaultOgImage(config);

  return {
    title: `管理画面 | ${title}`,
    description: `${title}の管理者用ページです。`,
    openGraph: {
      type: "website",
      title: `管理画面 | ${title}`,
      description: `${title}の管理者用ページです。`,
      images: ogImages,
    },
  };
}
