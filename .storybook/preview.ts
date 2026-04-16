import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import "../src/app/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { nestMessages } from "../src/lib/i18n/nestMessages";

import transactions from "../src/messages/ja/transactions.json";
import common from "../src/messages/ja/common.json";
import users from "../src/messages/ja/users.json";
import navigation from "../src/messages/ja/navigation.json";
import adminVotes from "../src/messages/ja/adminVotes.json";

const messages = nestMessages({
  ...common,
  ...navigation,
  ...transactions,
  ...users,
  ...adminVotes,
});

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
    NextIntlClientProvider,
    { locale: "ja", messages, timeZone: "Asia/Tokyo" },
    React.createElement(
      MockAuthProvider,
      null,
      React.createElement(MockHeaderProvider, null, children)
    )
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

    viewport: {
      options: {
        mobile: {
          name: "iPhone SE (375px)",
          styles: { width: "375px", height: "667px" },
          type: "mobile",
        },
        mobileLarge: {
          name: "iPhone 14 Pro (390px)",
          styles: { width: "390px", height: "844px" },
          type: "mobile",
        },
        tablet: {
          name: "iPad (768px)",
          styles: { width: "768px", height: "1024px" },
          type: "tablet",
        },
        desktop: {
          name: "Desktop (1280px)",
          styles: { width: "1280px", height: "800px" },
          type: "desktop",
        },
      },
    },
  },
  initialGlobals: {
    viewport: { value: "mobile", isRotated: false },
  },
  decorators: [
    (Story) => React.createElement(MockProviders, null, React.createElement(Story)),
  ],
};

export default preview;
