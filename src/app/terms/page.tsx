import { getTermsContent } from "@/lib/communities/terms";
import { convertMarkdownToHtml } from "@/utils/markdownUtils";
import TermsPageClient from "./TermsPageClient";
import { getCommunityConfig } from "@/lib/graphql/getCommunityConfig";
import { handleExternalDocumentRedirect } from "@/lib/communities/documents";
import { headers, cookies } from "next/headers";

export default async function TermsPage() {
  // Get communityId from request headers (set by middleware) or cookies
  const headersList = await headers();
  const cookieStore = await cookies();
  const communityId = headersList.get("x-community-id") || cookieStore.get("communityId")?.value || "";
  
  // Fetch community config from database
  const communityConfig = await getCommunityConfig(communityId);
  
  await handleExternalDocumentRedirect(
    communityConfig?.commonDocumentOverrides?.terms,
  );

  const termsMarkdown = getTermsContent();
  const html = await convertMarkdownToHtml(termsMarkdown);

  return <TermsPageClient html={html} />;
}
