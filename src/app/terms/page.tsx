import { getTermsContent } from "@/lib/communities/terms";
import { convertMarkdownToHtml } from "@/utils/markdownUtils";
import TermsPageClient from "./TermsPageClient";
import { getCommunityConfig } from "@/lib/communities/config";
import { getCommunityIdFromHeader } from "@/lib/community/get-community-id-server";
import { handleExternalDocumentRedirect } from "@/lib/communities/documents";

export default async function TermsPage() {
  const communityId = await getCommunityIdFromHeader();
  const communityConfig = await getCommunityConfig(communityId);
  
  await handleExternalDocumentRedirect(
    communityConfig?.commonDocumentOverrides?.terms,
  );

  const termsMarkdown = getTermsContent(communityId);
  const html = await convertMarkdownToHtml(termsMarkdown);

  return <TermsPageClient html={html} />;
}
