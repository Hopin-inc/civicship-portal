import { Metadata } from "next";
import { getCommunityConfig, getDefaultOgImage } from "@/lib/communities/config";
import { getCommunityIdFromHeader } from "@/lib/community/get-community-id-server";

export async function generateMetadata(): Promise<Metadata> {
  const communityId = await getCommunityIdFromHeader();
  const config = communityId ? await getCommunityConfig(communityId) : null;

  const title = config?.title || "";
  const domain = config?.domain || "";
  const ogImages = getDefaultOgImage(config);

  return {
    title: `${title} - ログイン`,
    description: `ログインして、あなただけの${title}を。`,
    openGraph: {
      title: `${title} - ログイン`,
      description: `ログインして、あなただけの${title}を。`,
      url: `${domain}/login`,
      type: "website",
      locale: "ja_JP",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - ログイン`,
      description: `ログインして、あなただけの${title}を。`,
      images: ogImages,
    },
    alternates: {
      canonical: `${domain}/login`,
    },
  };
}
