import { getTermsContent } from "@/lib/communities/terms";
import { convertMarkdownToHtml } from "@/utils/markdownUtils";
import TermsPageClient from "./TermsPageClient";
import { currentCommunityConfig } from "@/lib/communities/metadata";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export default async function TermsPage() {
  const termsOverride = currentCommunityConfig.commonDocumentOverrides?.terms;
  
  if (termsOverride && termsOverride.type === "external") {
    const locale = await getLocale();
    const path = termsOverride.path.replace(/{locale}/g, locale);
    redirect(path);
  }

  const termsMarkdown = getTermsContent();
  const html = await convertMarkdownToHtml(termsMarkdown);

  return <TermsPageClient html={html} />;
}
