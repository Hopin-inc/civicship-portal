import { getTermsContent } from "@/lib/communities/terms";
import { convertMarkdownToHtml } from "@/utils/markdownUtils";
import TermsPageClient from "./TermsPageClient";

export default async function TermsPage() {
  const termsMarkdown = getTermsContent();
  const html = await convertMarkdownToHtml(termsMarkdown);
  
  return <TermsPageClient html={html} />;
}
