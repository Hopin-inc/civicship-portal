import { Metadata } from "next";
import { getCommunityConfigFromEnv, getDefaultOgImage } from "@/lib/communities/config";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getCommunityConfigFromEnv();
  
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
