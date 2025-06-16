import micromatch from "micromatch";

export type EncodedURIComponent = string & { __brand: 'EncodedURIComponent' };
export type RawURIComponent = string & { __brand: 'RawURIComponent' };

type EncodeResult<T> = T extends RawURIComponent ? EncodedURIComponent : null;
type DecodeResult<T> = T extends EncodedURIComponent ? RawURIComponent : null;

export const encodeURIComponentWithType = <T extends RawURIComponent | null>(param: T): EncodeResult<T> => {
  if (param === null) return null as EncodeResult<T>;
  return encodeURIComponent(param) as EncodeResult<T>;
};

export const decodeURIComponentWithType = <T extends EncodedURIComponent | null>(param: T): DecodeResult<T> => {
  if (param === null) return null as DecodeResult<T>;
  return decodeURIComponent(param) as DecodeResult<T>;
};

export const matchPaths = (pathname: string, ...pathPatterns: string[]) => {
  const pathOnly = pathname.split(/[?#]/, 1)[0];
  return pathPatterns.some((path) => micromatch.isMatch(pathOnly, path));
};

export const extractSearchParamFromRelativePath = (relativePath: string, key: string): string | null => {
  // ダミーの origin を付与して URL オブジェクトを作成
  const url = new URL(relativePath, "https://example.com");
  return url.searchParams.get(key);
}
