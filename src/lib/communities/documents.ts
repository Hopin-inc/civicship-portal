import "server-only";
import { getLocale } from "next-intl/server";
import type { CommunityDocumentConfig } from "@/lib/communities/config";
import { appRedirect } from "@/lib/navigation/server";

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
    // External paths should skip path resolution
    await appRedirect(path, { skipPathResolution: true });
  }
}
