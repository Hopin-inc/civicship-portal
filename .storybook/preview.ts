import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import "../src/app/globals.css";

const mockAuthValue = {
  user: { id: "mock-user-id", name: "Mock User" },
  firebaseUser: null,
  uid: "mock-uid",
  isAuthenticated: true,
  isPhoneVerified: true,
  isUserRegistered: true,
  authenticationState: "user_registered" as const,
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

const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const AuthContext = React.createContext(mockAuthValue);
  return React.createElement(AuthContext.Provider, { value: mockAuthValue }, children);
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
