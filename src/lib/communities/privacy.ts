import fs from "fs";
import path from "path";

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
    console.error(`Failed to read privacy file at ${privacyPath}:`, error);
    throw new Error(`Privacy file not found: default.md`);
  }
}
