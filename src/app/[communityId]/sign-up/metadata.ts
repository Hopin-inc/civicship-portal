import { Metadata } from "next";
import { getCommunityConfigFromEnv, getDefaultOgImage } from "@/lib/communities/config";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const [t, config] = await Promise.all([
    getTranslations("auth.signup.metadata"),
    getCommunityConfigFromEnv(),
  ]);

  const communityTitle = config?.title || "";
  const domain = config?.domain || "";
  const ogImages = getDefaultOgImage(config);

  const title = t("title", { communityTitle });
  const description = t("description", { communityTitle });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${domain}/sign-up`,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
    alternates: {
      canonical: `${domain}/sign-up`,
    },
  };
}
