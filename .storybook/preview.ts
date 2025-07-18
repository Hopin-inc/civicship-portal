import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import "../src/app/globals.css";

const AuthContext = React.createContext<any>(null);

const mockUseAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      firebaseUser: null,
      uid: null,
      isAuthenticated: false,
      isPhoneVerified: false,
      isUserRegistered: false,
      authenticationState: "unauthenticated" as const,
      isAuthenticating: false,
      environment: "development" as const,
      loginWithLiff: async () => false,
      logout: async () => {},
      phoneAuth: {
        startPhoneVerification: async () => null,
        verifyPhoneCode: async () => false,
        clearRecaptcha: () => {},
        isVerifying: false,
        phoneUid: null,
      },
      createUser: async () => null,
      updateAuthState: async () => {},
      loading: false,
    };
  }
  return context;
};

const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const mockAuthValue = {
    user: null,
    firebaseUser: null,
    uid: null,
    isAuthenticated: false,
    isPhoneVerified: false,
    isUserRegistered: false,
    authenticationState: "unauthenticated" as const,
    isAuthenticating: false,
    environment: "development" as const,
    loginWithLiff: async () => false,
    logout: async () => {},
    phoneAuth: {
      startPhoneVerification: async () => null,
      verifyPhoneCode: async () => false,
      clearRecaptcha: () => {},
      isVerifying: false,
      phoneUid: null,
    },
    createUser: async () => null,
    updateAuthState: async () => {},
    loading: false,
  };

  return React.createElement(
    AuthContext.Provider,
    { value: mockAuthValue },
    children
  );
};

const MockHeaderProvider = ({ children }: { children: React.ReactNode }) => {
  const mockHeaderContext = {
    config: {
      hideHeader: false,
      showBackButton: false,
      showLogo: true,
      showSearchForm: false,
    },
    setConfig: () => {},
  };

  return React.createElement(
    React.createContext(mockHeaderContext).Provider,
    { value: mockHeaderContext },
    children
  );
};

const MockProviders = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(
    MockAuthProvider,
    null,
    React.createElement(MockHeaderProvider, null, children)
  );
};

if (typeof window !== 'undefined') {
  const mockLogger = {
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {},
  };
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [
    (Story) => React.createElement(MockProviders, null, React.createElement(Story)),
  ],
};

export default preview;
