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
