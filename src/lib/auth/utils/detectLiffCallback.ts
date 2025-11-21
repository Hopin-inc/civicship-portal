/**
 * Detects if the current request is a LIFF OAuth callback
 * by checking for the presence of required query parameters.
 * 
 * @param search - The URL search string (e.g., "?code=...&state=...&liffClientId=...")
 * @returns true if this is a LIFF callback, false otherwise
 */
export function detectLiffCallback(search: string): boolean {
  const searchParams = new URLSearchParams(search);
  return (
    searchParams.has("code") && 
    (searchParams.has("state") || searchParams.has("liff.state")) && 
    searchParams.has("liffClientId")
  );
}
