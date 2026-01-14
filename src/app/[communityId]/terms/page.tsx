import { getTermsContent } from "@/lib/communities/terms";
import { convertMarkdownToHtml } from "@/utils/markdownUtils";
import TermsPageClient from "./TermsPageClient";
import { getCommunityConfig, getCommunityIdFromEnv } from "@/lib/communities/config";
import { handleExternalDocumentRedirect } from "@/lib/communities/documents";

export default async function TermsPage() {
  const communityId = getCommunityIdFromEnv();
  const communityConfig = await getCommunityConfig(communityId);
  
  await handleExternalDocumentRedirect(
    communityConfig?.commonDocumentOverrides?.terms,
  );

  const termsMarkdown = getTermsContent();
  const html = await convertMarkdownToHtml(termsMarkdown);

  return <TermsPageClient html={html} />;
}
