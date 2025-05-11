"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import liff from '@line/liff';

type LiffProfile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
};

type LiffContextType = {
  liff: typeof liff | null;
  isInLiff: boolean;
  isLiffLoggedIn: boolean;
  liffError: string | null;
  liffProfile: LiffProfile | null;
  liffIdToken: string | null;
  liffAccessToken: string | null;
  liffInit: () => Promise<void>;
  liffLogin: () => void;
  liffLogout: () => void;
};

const LiffContext = createContext<LiffContextType | undefined>(undefined);

type LiffProviderProps = {
  children: ReactNode;
};

export const LiffProvider = ({ children }: LiffProviderProps) => {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID || '';
  const [isLiffInitialized, setIsLiffInitialized] = useState<boolean>(false);
  const [isInLiff, setIsInLiff] = useState<boolean>(false);
  const [isLiffLoggedIn, setIsLiffLoggedIn] = useState<boolean>(false);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [liffProfile, setLiffProfile] = useState<LiffProfile | null>(null);
  const [liffIdToken, setLiffIdToken] = useState<string | null>(null);
  const [liffAccessToken, setLiffAccessToken] = useState<string | null>(null);

  const updateLiffProfile = useCallback(async () => {
    try {
      const profile = await liff.getProfile();
      setLiffProfile({
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl
      });
    } catch (error) {
      console.error('Failed to get LIFF profile:', error);
    }
  }, []);

  const updateLiffTokens = useCallback(() => {
    try {
      const accessToken = liff.getAccessToken();
      setLiffAccessToken(accessToken);
      
      const idToken = liff.getIDToken();
      setLiffIdToken(idToken);
      
    } catch (error) {
      console.error('Failed to get LIFF tokens:', error);
    }
  }, []);

  const liffInit = useCallback(async () => {
    try {
      await liff.init({ liffId });
      setIsLiffInitialized(true);
      
      setIsInLiff(liff.isInClient());
      setIsLiffLoggedIn(liff.isLoggedIn());
      
      if (liff.isLoggedIn()) {
        await updateLiffProfile();
        updateLiffTokens();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setLiffError(errorMessage);
      console.error('LIFF initialization failed:', error);
    }
  }, [liffId, updateLiffProfile, updateLiffTokens]);

  const liffLogin = useCallback(() => {
    if (!isLiffInitialized) {
      liffInit().then(() => {
        liff.login({ redirectUri: window.location.href });
      });
      return;
    }
    
    liff.login({ redirectUri: window.location.href });
  }, [isLiffInitialized, liffInit]);

  const liffLogout = useCallback(() => {
    if (liff.isLoggedIn()) {
      liff.logout();
      setIsLiffLoggedIn(false);
      setLiffProfile(null);
      setLiffIdToken(null);
      setLiffAccessToken(null);
    }
  }, []);

  useEffect(() => {
    liffInit().catch(console.error);
  }, [liffId, liffInit]);

  useEffect(() => {
    if (isLiffInitialized && liff.isLoggedIn() && !liffProfile) {
      updateLiffProfile();
      updateLiffTokens();
      setIsLiffLoggedIn(true);
    }
  }, [isLiffInitialized, liffProfile, updateLiffProfile, updateLiffTokens]);

  return (
    <LiffContext.Provider
      value={{
        liff: isLiffInitialized ? liff : null,
        isInLiff,
        isLiffLoggedIn,
        liffError,
        liffProfile,
        liffIdToken,
        liffAccessToken,
        liffInit,
        liffLogin,
        liffLogout
      }}
    >
      {children}
    </LiffContext.Provider>
  );
};

export const useLiff = () => {
  const context = useContext(LiffContext);
  if (context === undefined) {
    throw new Error("useLiff must be used within a LiffProvider");
  }
  return context;
};
