import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/nextjs-vite",
    "options": {}
  },
  "staticDirs": [
    "../public"
  ],
  "viteFinal": async (config) => {
    config.define = {
      ...config.define,
      'process.env.ENV': JSON.stringify('STORYBOOK'),
    };
    
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/contexts/AuthProvider': require.resolve('./mocks/AuthProvider.js'),
    };
    
    config.plugins = config.plugins || [];
    config.plugins.push({
      name: 'mock-auth-provider',
      transform(code: string, id: string) {
        if (id.includes('RouteGuard') || id.includes('MainContent')) {
          return code.replace(
            /import\s*{\s*useAuth\s*}\s*from\s*['"]@\/contexts\/AuthProvider['"]/g,
            'const useAuth = () => ({ user: null, firebaseUser: null, uid: null, isAuthenticated: false, isPhoneVerified: false, isUserRegistered: false, authenticationState: "unauthenticated", isAuthenticating: false, environment: "development", loginWithLiff: async () => false, logout: async () => {}, phoneAuth: { startPhoneVerification: async () => null, verifyPhoneCode: async () => false, clearRecaptcha: () => {}, isVerifying: false, phoneUid: null }, createUser: async () => null, updateAuthState: async () => {}, loading: false })'
          );
        }
        return null;
      },
    });
    
    return config;
  }
};
export default config;
