import { Metadata } from "next";
import { getCommunityConfigFromEnv, getDefaultOgImage } from "@/lib/communities/config";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getCommunityConfigFromEnv();
  
  const title = config?.title || "";
  const domain = config?.domain || "";
  const ogImages = getDefaultOgImage(config);
  
  return {
    title: `${title} - 利用規約`,
    description: `${title}をご利用いただく際の規約をご案内します。`,
    openGraph: {
      title: `${title} - 利用規約`,
      description: `${title}をご利用いただく際の規約をご案内します。`,
      url: `${domain}/terms`,
      type: "website",
      locale: "ja_JP",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - 利用規約`,
      description: `${title}をご利用いただく際の規約をご案内します。`,
      images: ogImages,
    },
    alternates: {
      canonical: `${domain}/terms`,
    },
  };
}
