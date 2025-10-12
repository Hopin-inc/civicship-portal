import fs from "fs";
import path from "path";
import { getCommunityIdFromEnv } from "./metadata";
import { COMMUNITY_CONTENT } from "./content";

export function getTermsContent(): string {
  const communityId = getCommunityIdFromEnv();
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
