import { Metadata } from "next";
import { getCommunityConfig, getDefaultOgImage } from "@/lib/communities/config";

export async function generateMetadata({ params }: { params: Promise<{ communityId: string }> }): Promise<Metadata> {
  const { communityId } = await params;
  const config = await getCommunityConfig(communityId);
  
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
