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
    title: `${title} - プライバシーポリシー`,
    description: "個人情報の取り扱いについてご確認いただけます。",
    openGraph: {
      title: `${title} - プライバシーポリシー`,
      description: "個人情報の取り扱い方針についてご確認いただけます。",
      url: `${domain}/privacy`,
      type: "website",
      locale: "ja_JP",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - プライバシーポリシー`,
      description: "個人情報の取り扱い方針についてご確認いただけます。",
      images: ogImages,
    },
    alternates: {
      canonical: `${domain}/privacy`,
    },
  };
}
