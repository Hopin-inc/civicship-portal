type Params = {
  state: string;
  nonce: string;
  /** LINE Login channel ID (liffAppId from CommunityPortalConfig) */
  clientId: string;
};

export const LINE_AUTH_REDIRECT_URI = `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/line`;

/**
 * Generate LINE OAuth authorization URL
 * @param params - Parameters including state, nonce, and clientId from CommunityPortalConfig.liffAppId
 */
export const generateAuthUrl = ({ state, nonce, clientId }: Params) => {
  return (
    `https://access.line.me/oauth2/v2.1/authorize?response_type=code` +
    `&client_id=${clientId}` +
    `&redirect_uri=${LINE_AUTH_REDIRECT_URI}` +
    `&state=${state}` +
    `&nonce=${nonce}` +
    `&bot_prompt=normal&scope=profile%20openid&prompt=consent`
  );
};
