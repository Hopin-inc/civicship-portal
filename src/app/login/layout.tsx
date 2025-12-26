import { Metadata } from "next";
import { headers, cookies } from "next/headers";
import { getCommunityConfig } from "@/lib/communities/getCommunityConfig";
import { COMMUNITY_ID, COMMUNITY_BASE_CONFIG } from "@/lib/communities/metadata";

export async function generateMetadata(): Promise<Metadata> {
  // Get communityId from request headers (set by middleware) or cookies or env var
  const headersList = await headers();
  const cookieStore = await cookies();
  const communityId = headersList.get("x-community-id") || cookieStore.get("communityId")?.value || COMMUNITY_ID;
  
  // Try to get config from database first, fallback to hardcoded config
  let config = await getCommunityConfig(communityId);
  if (!config) {
    const baseConfig = COMMUNITY_BASE_CONFIG[communityId] || COMMUNITY_BASE_CONFIG.default;
    config = {
      communityId: baseConfig.id,
      tokenName: baseConfig.tokenName,
      title: baseConfig.title,
      description: baseConfig.description,
      shortDescription: baseConfig.shortDescription || null,
      domain: baseConfig.domain,
      faviconPrefix: baseConfig.faviconPrefix,
      logoPath: baseConfig.logoPath,
      squareLogoPath: baseConfig.squareLogoPath,
      ogImagePath: baseConfig.ogImagePath,
      enableFeatures: baseConfig.enableFeatures,
      rootPath: baseConfig.rootPath || "/",
      adminRootPath: baseConfig.adminRootPath || "/admin",
      documents: baseConfig.documents || null,
      commonDocumentOverrides: baseConfig.commonDocumentOverrides || null,
      regionName: null,
      regionKey: null,
      liffId: null,
      liffBaseUrl: null,
      firebaseTenantId: null,
    };
  }

  const title = `${config.title} - ログイン`;
  const description = `ログインして、あなただけの${config.title}を。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${config.domain}/login`,
      type: "website",
      locale: "ja_JP",
      images: [
        {
          url: config.ogImagePath,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: config.ogImagePath,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
    },
    alternates: {
      canonical: `${config.domain}/login`,
    },
  };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
