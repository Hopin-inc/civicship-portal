import { getTermsContent } from "@/lib/communities/terms";
import { convertMarkdownToHtml } from "@/utils/markdownUtils";
import TermsPageClient from "./TermsPageClient";
import { getCommunityConfig } from "@/lib/communities/config";
import { handleExternalDocumentRedirect } from "@/lib/communities/documents";

interface PageProps {
  params: Promise<{ communityId: string }>;
}

export default async function TermsPage({ params }: PageProps) {
  const { communityId } = await params;
  const communityConfig = await getCommunityConfig(communityId);
  
  await handleExternalDocumentRedirect(
    communityConfig?.commonDocumentOverrides?.terms,
  );

  const termsMarkdown = getTermsContent(communityId);
  const html = await convertMarkdownToHtml(termsMarkdown);

  return <TermsPageClient html={html} />;
}
