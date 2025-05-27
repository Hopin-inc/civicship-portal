import micromatch from "micromatch";

export const matchPaths = (pathname: string, ...pathPatterns: string[]) => {
  const pathOnly = pathname.split(/[?#]/, 1)[0];
  return pathPatterns.some((path) => micromatch.isMatch(pathOnly, path));
};

export const extractSearchParamFromRelativePath = (relativePath: string, key: string): string | null => {
  // ダミーの origin を付与して URL オブジェクトを作成
  const url = new URL(relativePath, "https://example.com");
  return url.searchParams.get(key);
}
