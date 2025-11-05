export function shortenMiddle(str: string | undefined, head: number = 6, tail: number = 4): string {
  if (!str) return "";
  if (str.length <= head + tail) return str;
  return `${str.substring(0, head)}...${str.substring(str.length - tail)}`;
}
