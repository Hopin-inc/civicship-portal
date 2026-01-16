// app/admin/metadata.ts
import { Metadata } from "next";
import { getCommunityConfigFromEnv, getDefaultOgImage } from "@/lib/communities/config";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getCommunityConfigFromEnv();
  
  const title = config?.title || "";
  const ogImages = getDefaultOgImage(config);
  
  return {
    title: `管理画面 | ${title}`,
    description: `${title}の管理者用ページです。`,
    openGraph: {
      type: "website",
      title: `管理画面 | ${title}`,
      description: `${title}の管理者用ページです。`,
      images: ogImages,
    },
  };
}
