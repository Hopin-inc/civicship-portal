import { convertMarkdownToHtml } from "@/utils/markdownUtils";
import { getCommunityConfig } from "@/lib/communities/config";
import PrivacyPageClient from "./PrivacyPageClient";
import { getPrivacyContent } from "@/lib/communities/privacy";
import { handleExternalDocumentRedirect } from "@/lib/communities/documents";

interface PageProps {
  params: Promise<{ communityId: string }>;
}

export default async function PrivacyPage({ params }: PageProps) {
  const { communityId } = await params;
  const communityConfig = await getCommunityConfig(communityId);
  
  await handleExternalDocumentRedirect(
    communityConfig?.commonDocumentOverrides?.privacy,
  );

  const policyMarkdown = getPrivacyContent();
  const html = await convertMarkdownToHtml(policyMarkdown);
  
  return <PrivacyPageClient html={html} />;
}
