/**
 * Transform IPFS gateway URL from ipfs.io to cloudflare-ipfs.com
 * This helps avoid "url parameter is valid but upstream response is invalid" errors
 * caused by ipfs.io returning 304 Not Modified or incorrect Content-Type headers
 */
export function transformIpfsUrl(url: string | null | undefined): string | null | undefined {
  if (!url) return url;
  
  const ipfsIoPattern = /^https?:\/\/ipfs\.io\/ipfs\//i;
  if (!ipfsIoPattern.test(url)) {
    return url;
  }
  
  let transformed = url.replace(ipfsIoPattern, 'https://cloudflare-ipfs.com/ipfs/');
  
  if (!/[?&]filename=/.test(transformed)) {
    transformed += (transformed.includes('?') ? '&' : '?') + 'filename=image.png';
  }
  
  return transformed;
}
