import { Metadata } from "next";
import { getCommunityConfigFromEnv, getDefaultOgImage } from "@/lib/communities/config";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getCommunityConfigFromEnv();
  
  const title = config?.title || "";
  const ogImages = getDefaultOgImage(config);
  
  return {
    title: `申込内容の確認 | ${title}`,
    description: "申込内容をご確認ください。",
    openGraph: {
      type: "website",
      title: `申込内容の確認 | ${title}`,
      description: "申込内容をご確認ください。",
      images: ogImages,
    },
  };
}
