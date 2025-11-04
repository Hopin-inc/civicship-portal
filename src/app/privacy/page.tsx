import { convertMarkdownToHtml } from "@/utils/markdownUtils";
import { currentCommunityConfig } from "@/lib/communities/metadata";
import PrivacyPageClient from "./PrivacyPageClient";
import { getPrivacyContent } from "@/lib/communities/privacy";
import { handleExternalDocumentRedirect } from "@/lib/communities/documents";

export default async function PrivacyPage() {
  await handleExternalDocumentRedirect(
    currentCommunityConfig.commonDocumentOverrides?.privacy,
  );

  const policyMarkdown = getPrivacyContent();
  const html = await convertMarkdownToHtml(policyMarkdown);
  
  return <PrivacyPageClient html={html} />;
}
