// app/admin/metadata.ts
import { Metadata } from "next";
import { getCommunityConfig, getDefaultOgImage } from "@/lib/communities/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ communityId: string }>;
}): Promise<Metadata> {
  const { communityId } = await params;
  const config = await getCommunityConfig(communityId);
  
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
