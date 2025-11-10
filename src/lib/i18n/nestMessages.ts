/**
 * Convert flat dotted keys to nested object structure
 * 
 * Example:
 * Input: { "common.loading": "Loading...", "common.error": "Error" }
 * Output: { common: { loading: "Loading...", error: "Error" } }
 */
export function nestMessages(flat: Record<string, string>): Record<string, any> {
  const nested: Record<string, any> = {};

  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.');
    let current = nested;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;
  }

  return nested;
}
