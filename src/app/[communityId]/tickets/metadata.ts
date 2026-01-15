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
  const domain = config?.domain || "";
  const ogImages = getDefaultOgImage(config);
  
  return {
    title: `${title} - チケット`,
    description: "これからの体験で使えるチケットを、こちらで確認できます。",
    openGraph: {
      title: `${title} - チケット`,
      description: "これからの体験で使えるチケットを、こちらで確認できます。",
      url: `${domain}/tickets`,
      type: "website",
      locale: "ja_JP",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - チケット`,
      description: "これからの体験で使えるチケットを、こちらで確認できます。",
      images: ogImages,
    },
    alternates: {
      canonical: `${domain}/tickets`,
    },
  };
}
