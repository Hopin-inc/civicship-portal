import fs from "fs";
import path from "path";
import { COMMUNITY_CONTENT } from "./content";

/**
 * Get terms content for a specific community
 * @param communityId - Community ID from URL path parameter (required for multi-tenant routing)
 */
export function getTermsContent(communityId: string): string {
  const content = COMMUNITY_CONTENT[communityId];

  const termsFile = content?.termsFile || COMMUNITY_CONTENT.default.termsFile;

  if (!content || !content.termsFile) {
    console.warn(
      `Terms content for community "${communityId}" is not configured. Using default terms.`,
    );
  }

  const termsPath = path.join(
    process.cwd(),
    "src",
    "lib",
    "communities",
    "terms",
    termsFile,
  );

  try {
    return fs.readFileSync(termsPath, "utf-8");
  } catch (error) {
    console.error(`Failed to read terms file at ${termsPath}:`, error);
    throw new Error(`Terms file not found: ${termsFile}`);
  }
}
