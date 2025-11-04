import { convertMarkdownToHtml } from "@/utils/markdownUtils";
import { currentCommunityConfig } from "@/lib/communities/metadata";
import { redirect } from "next/navigation";
import PrivacyPageClient from "./PrivacyPageClient";
import { getPrivacyContent } from "@/lib/communities/privacy";
import { getLocale } from "next-intl/server";

export default async function PrivacyPage() {
  const privacyOverride = currentCommunityConfig.commonDocumentOverrides?.privacy;
  
  if (privacyOverride && privacyOverride.type === "external") {
    const locale = await getLocale();
    const path = privacyOverride.path.replace(/{locale}/g, locale);
    redirect(path);
  }

  const policyMarkdown = getPrivacyContent();
  const html = await convertMarkdownToHtml(policyMarkdown);
  
  return <PrivacyPageClient html={html} />;
}
