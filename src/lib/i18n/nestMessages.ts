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

      // Check if the current part already exists as a string value
      if (current[part] !== undefined && typeof current[part] !== 'object') {
        const currentPath = parts.slice(0, i + 1).join('.');
        throw new Error(
          `Translation key conflict: "${currentPath}" is already defined as a string value, ` +
          `but "${key}" tries to use it as a parent key. ` +
          `Current value: "${current[part]}". ` +
          `Use either the base key "${currentPath}" or the nested key "${key}", but not both.`
        );
      }

      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    const lastPart = parts[parts.length - 1];

    // Check if the last part is trying to override an object with nested keys
    if (current[lastPart] !== undefined && typeof current[lastPart] === 'object') {
      throw new Error(
        `Translation key conflict: "${key}" tries to set a string value, ` +
        `but it already has nested keys defined. ` +
        `Either remove the nested keys or use "${key}.generic" or similar for the base value.`
      );
    }

    current[lastPart] = value;
  }

  return nested;
}
