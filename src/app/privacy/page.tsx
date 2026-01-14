import { convertMarkdownToHtml } from "@/utils/markdownUtils";
import { getCommunityConfig, getCommunityIdFromEnv } from "@/lib/communities/config";
import PrivacyPageClient from "./PrivacyPageClient";
import { getPrivacyContent } from "@/lib/communities/privacy";
import { handleExternalDocumentRedirect } from "@/lib/communities/documents";

export default async function PrivacyPage() {
  const communityId = getCommunityIdFromEnv();
  const communityConfig = await getCommunityConfig(communityId);
  
  await handleExternalDocumentRedirect(
    communityConfig?.commonDocumentOverrides?.privacy,
  );

  const policyMarkdown = getPrivacyContent();
  const html = await convertMarkdownToHtml(policyMarkdown);
  
  return <PrivacyPageClient html={html} />;
}
