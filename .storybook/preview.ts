import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import {
  GetTransactionsDocument,
  GetMembershipListDocument,
  GetDidIssuanceRequestsDocument,
} from "../src/types/graphql";
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
  return children;
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

const MockApolloProvider = ({ children }: { children: React.ReactNode }) => {
  const mocks = [
    {
      request: {
        query: GetTransactionsDocument,
      },
      result: {
        data: {
          transactions: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
            totalCount: 0,
          },
        },
      },
    },
    {
      request: {
        query: GetMembershipListDocument,
      },
      result: {
        data: {
          memberships: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
            totalCount: 0,
          },
        },
      },
    },
    {
      request: {
        query: GetDidIssuanceRequestsDocument,
      },
      result: {
        data: {
          users: {
            edges: [],
          },
        },
      },
    },
  ];

  return React.createElement(
    MockedProvider,
    { mocks, addTypename: false },
    children
  );
};

const MockProviders = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(
    MockApolloProvider,
    null,
    React.createElement(
      MockAuthProvider,
      null,
      React.createElement(MockHeaderProvider, null, children)
    )
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
