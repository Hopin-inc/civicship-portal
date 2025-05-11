import micromatch from "micromatch";

export const matchPaths = (pathname: string, ...pathPatterns: string[]) => {
  const pathOnly = pathname.split(/[?#]/, 1)[0];
  return pathPatterns.some((path) => micromatch.isMatch(pathOnly, path));
};
