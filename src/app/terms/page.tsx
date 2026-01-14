import { getTermsContent } from "@/lib/communities/terms";
import { convertMarkdownToHtml } from "@/utils/markdownUtils";
import TermsPageClient from "./TermsPageClient";
import { currentCommunityConfig } from "@/lib/communities/metadata";
import { handleExternalDocumentRedirect } from "@/lib/communities/documents";

export default async function TermsPage() {
  await handleExternalDocumentRedirect(
    currentCommunityConfig.commonDocumentOverrides?.terms,
  );

  const termsMarkdown = getTermsContent();
  const html = await convertMarkdownToHtml(termsMarkdown);

  return <TermsPageClient html={html} />;
}
