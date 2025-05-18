import { Cookies } from "next-client-cookies";

export const setCookies = (
  cookies: Cookies,
  authToken: string | null,
  refreshToken: string | null,
  tokenExpiresAt: Date | null,
  prefix: string = ""
): void => {
  const cookiePrefix = prefix ? `${prefix}_` : "";

  if (authToken) {
    cookies.set(`${cookiePrefix}auth_token`, authToken, {
      secure: true,
      sameSite: "Strict"
    });
  }

  if (refreshToken) {
    cookies.set(`${cookiePrefix}refresh_token`, refreshToken);
  }

  if (tokenExpiresAt) {
    const timestamp = Math.floor(tokenExpiresAt.getTime() / 1000);
    cookies.set(`${cookiePrefix}token_expires_at`, timestamp.toString());
  }

  console.log(`Stored ${prefix} tokens in cookies:`, {
    authToken: authToken ? "present" : "missing",
    refreshToken: refreshToken ? "present" : "missing",
    tokenExpiresAt: tokenExpiresAt
  });
};

export const removeCookies = (
  cookies: Cookies,
  prefix: string = ""
): void => {
  const cookiePrefix = prefix ? `${prefix}_` : "";
  
  cookies.remove(`${cookiePrefix}auth_token`);
  cookies.remove(`${cookiePrefix}refresh_token`);
  cookies.remove(`${cookiePrefix}token_expires_at`);
  
  console.log(`Removed ${prefix} tokens from cookies`);
};
