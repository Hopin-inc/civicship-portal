declare interface Window {
  liff: {
    init: (config: { liffId: string }) => Promise<void>;
    isInClient: () => boolean;
    isLoggedIn: () => boolean;
    login: (options?: { redirectUri?: string }) => void;
    logout: () => void;
    getAccessToken: () => string;
    getProfile: () => Promise<{
      userId: string;
      displayName: string;
      pictureUrl?: string;
      statusMessage?: string;
    }>;
  };
}
