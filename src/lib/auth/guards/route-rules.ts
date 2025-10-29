export const PROTECTED_PATHS = ["/users/me", "/tickets", "/wallets", "/admin"];

export const AUTH_ENTRY_PATHS = ["/login", "/sign-up", "/sign-up/phone-verification"];

export function isProtectedPath(path: string): boolean {
  return PROTECTED_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

export function isAuthEntryPath(path: string): boolean {
  return AUTH_ENTRY_PATHS.includes(path);
}
