import React from 'react';

const AuthContext = React.createContext(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === null) {
    return {
      user: null,
      firebaseUser: null,
      uid: null,
      isAuthenticated: false,
      isPhoneVerified: false,
      isUserRegistered: false,
      authenticationState: "unauthenticated",
      isAuthenticating: false,
      environment: "development",
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

export const AuthProvider = ({ children }) => {
  const mockAuthValue = {
    user: null,
    firebaseUser: null,
    uid: null,
    isAuthenticated: false,
    isPhoneVerified: false,
    isUserRegistered: false,
    authenticationState: "unauthenticated",
    isAuthenticating: false,
    environment: "development",
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
