type Params = {
  state: string;
  nonce: string;
};

export const LINE_AUTH_REDIRECT_URI = `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/line`;

export const generateAuthUrl = ({ state, nonce }: Params) => {
  return (
    `https://access.line.me/oauth2/v2.1/authorize?response_type=code` +
    `&client_id=${process.env.NEXT_PUBLIC_LINE_CLIENT}` +
    `&redirect_uri=${LINE_AUTH_REDIRECT_URI}` +
    `&state=${state}` +
    `&nonce=${nonce}` +
    `&bot_prompt=normal&scope=profile%20openid&prompt=consent`
  );
};
