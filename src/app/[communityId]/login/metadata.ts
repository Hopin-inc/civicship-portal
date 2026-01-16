import { Metadata } from "next";
import { getCommunityConfig, getDefaultOgImage } from "@/lib/communities/config";

export async function generateMetadata({ params }: { params: Promise<{ communityId: string }> }): Promise<Metadata> {
  const { communityId } = await params;
  const config = await getCommunityConfig(communityId);
  
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
