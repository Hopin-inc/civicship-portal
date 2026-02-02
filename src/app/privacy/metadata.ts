import { getCommunityConfigFromEnv, getDefaultOgImage } from "@/lib/communities/config";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getCommunityConfigFromEnv();
  
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
