import fs from "fs";
import path from "path";
import { logger } from "@/lib/logging";

export function getPrivacyContent(): string {
  const privacyPath = path.join(
    process.cwd(),
    "src",
    "lib",
    "communities",
    "privacy",
    "default.md",
  );

  try {
    return fs.readFileSync(privacyPath, "utf-8");
  } catch (error) {
    const errorMessage = "Privacy file not found: default.md";
    logger.error(errorMessage, {
      path: privacyPath,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error(errorMessage);
  }
}
