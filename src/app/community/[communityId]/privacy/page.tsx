import { notFound } from "next/navigation";
import { convertMarkdownToHtml } from "@/utils/markdownUtils";
import { getCommunityConfig } from "@/lib/communities/config";
import { getCommunityIdFromHeader } from "@/lib/community/get-community-id-server";
import PrivacyPageClient from "./PrivacyPageClient";
import { getPrivacyContent } from "@/lib/communities/privacy";
import { handleExternalDocumentRedirect } from "@/lib/communities/documents";

export default async function PrivacyPage() {
  const communityId = await getCommunityIdFromHeader();

  if (!communityId) {
    notFound();
  }

  const communityConfig = await getCommunityConfig(communityId);
  
  await handleExternalDocumentRedirect(
    communityConfig?.commonDocumentOverrides?.privacy,
  );

  const policyMarkdown = getPrivacyContent();
  const html = await convertMarkdownToHtml(policyMarkdown);
  
  return <PrivacyPageClient html={html} />;
}
