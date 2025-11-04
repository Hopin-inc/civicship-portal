import { convertMarkdownToHtml } from "@/utils/markdownUtils";
import { currentCommunityConfig } from "@/lib/communities/metadata";
import { redirect } from "next/navigation";
import PrivacyPageClient from "./PrivacyPageClient";
import { getPrivacyContent } from "@/lib/communities/privacy";

export default async function PrivacyPage() {
  const privacyOverride = currentCommunityConfig.commonDocumentOverrides?.privacy;
  
  if (privacyOverride && privacyOverride.type === "external") {
    redirect(privacyOverride.path);
  }

  const policyMarkdown = getPrivacyContent();
  const html = await convertMarkdownToHtml(policyMarkdown);
  
  return <PrivacyPageClient html={html} />;
}
