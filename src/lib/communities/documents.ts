import "server-only";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import type { CommunityDocumentConfig } from "@/lib/communities/config";

/**
 * Type alias for backward compatibility
 */
export type CommunityDocument = CommunityDocumentConfig;

/**
 * Handles external document redirects with locale placeholder replacement.
 * If the document is configured as external, redirects to the document path
 * with {locale} placeholders replaced by the current locale.
 *
 * @param document - The community document configuration
 */
export async function handleExternalDocumentRedirect(
  document?: CommunityDocument,
): Promise<void> {
  if (document && document.type === "external") {
    const locale = await getLocale();
    const path = document.path.replace(/{locale}/g, locale);
    redirect(path);
  }
}
