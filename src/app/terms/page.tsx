import { getTermsContent } from "@/lib/communities/terms";
import { convertMarkdownToHtml } from "@/utils/markdownUtils";
import TermsPageClient from "./TermsPageClient";
import { currentCommunityConfig } from "@/lib/communities/metadata";
import { redirect } from "next/navigation";

export default async function TermsPage() {
  const termsOverride = currentCommunityConfig.commonDocumentOverrides?.terms;
  
  if (termsOverride && termsOverride.type === "external") {
    redirect(termsOverride.path);
  }

  const termsMarkdown = getTermsContent();
  const html = await convertMarkdownToHtml(termsMarkdown);
  
  return <TermsPageClient html={html} />;
}
