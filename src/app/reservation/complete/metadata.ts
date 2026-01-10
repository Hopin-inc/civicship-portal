import { Metadata } from "next";
import { getCommunityConfigFromEnv, getDefaultOgImage } from "@/lib/communities/config";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getCommunityConfigFromEnv();
  
  const title = config?.title || "";
  const ogImages = getDefaultOgImage(config);
  
  return {
    title: `申込完了 | ${title}`,
    description: "お申し込みありがとうございます。参加を楽しみにお待ちください！",
    openGraph: {
      type: "website",
      title: `申込完了 | ${title}`,
      description: "お申し込みありがとうございます。参加を楽しみにお待ちください！",
      images: ogImages,
    },
  };
}
