import { Metadata } from "next";
import { getCommunityConfig, getDefaultOgImage } from "@/lib/communities/config";

const fallbackDescription = "体験が始まるその一歩は、ここから。文化と自然、人のあたたかさにふれる募集がそろいました。気になる体験を見つけて、あなただけの時間を過ごしてみませんか。";
const fallbackShortDescription = "文化と自然、人のあたたかさにふれる募集がそろいました。気になる体験を探してみませんか。";

export async function generateMetadata({ params }: { params: Promise<{ communityId: string }> }): Promise<Metadata> {
  const { communityId } = await params;
  const config = await getCommunityConfig(communityId);
  
  const title = config?.title || "";
  const domain = config?.domain || "";
  const description = config?.description || fallbackDescription;
  const shortDescription = config?.shortDescription || fallbackShortDescription;
  const ogImages = getDefaultOgImage(config);
  
  return {
    title: `${title} - 募集一覧`,
    description: description,
    openGraph: {
      title: `${title} - 募集一覧`,
      description: description,
      url: `${domain}/activities`,
      type: "website",
      locale: "ja_JP",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - 募集一覧`,
      description: shortDescription,
      images: ogImages,
    },
    alternates: {
      canonical: `${domain}/activities`,
    },
  };
}
