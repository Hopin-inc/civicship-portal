import { initializeApp } from "firebase/app";
import {
  getAuth,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithCustomToken,
  signInWithPhoneNumber,
  updateProfile,
} from "@firebase/auth";
import { LIFFLoginResponse } from "@/types/line";
// import { Analytics, getAnalytics, isSupported } from "@firebase/analytics";
import retry from "retry";

export { PhoneAuthProvider };

const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.tenantId = process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID ?? null;

// let analytics: Analytics;
// if (typeof window !== "undefined") {
//   isSupported().then((supported) => {
//     if (supported) {
//       analytics = getAnalytics(app);
//     }
//   });
// }
// export { analytics };

export const phoneApp = initializeApp(firebaseConfig, "phone-auth-app");
export const phoneAuth = getAuth(phoneApp);
phoneAuth.tenantId = null;

type PhoneVerificationState = {
  phoneNumber: string | null;
  verificationId: string | null;
  verified: boolean;
  phoneUid: string | null;
  authToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: Date | null;
};

export const phoneVerificationState: PhoneVerificationState = {
  phoneNumber: null,
  verificationId: null,
  verified: false,
  phoneUid: null,
  authToken: null,
  refreshToken: null,
  tokenExpiresAt: null,
};

const categorizeFirebaseError = (error: any): { type: string; message: string; retryable: boolean } => {
  if (error?.code) {
    const code = error.code as string;

    if (code === 'auth/network-request-failed') {
      return {
        type: 'network',
        message: 'ネットワーク接続に問題が発生しました。インターネット接続を確認してください。',
        retryable: true
      };
    }

    if (code === 'auth/user-token-expired' || code === 'auth/id-token-expired') {
      return {
        type: 'expired',
        message: '認証の有効期限が切れました。再認証が必要です。',
        retryable: false
      };
    }

    if (code === 'auth/invalid-credential' || code === 'auth/user-disabled') {
      return {
        type: 'auth',
        message: '認証情報が無効です。再ログインしてください。',
        retryable: false
      };
    }

    if (code === 'auth/requires-recent-login') {
      return {
        type: 'reauth',
        message: 'セキュリティのため再認証が必要です。',
        retryable: false
      };
    }
  }

  if (error?.message?.includes('LIFF authentication failed')) {
    return {
      type: 'api',
      message: 'LINE認証サービスとの通信に失敗しました。',
      retryable: true
    };
  }

  return {
    type: 'unknown',
    message: '認証中に予期せぬエラーが発生しました。',
    retryable: false
  };
};

export const signInWithLiffToken = async (accessToken: string): Promise<boolean> => {
  const operation = retry.operation({
    retries: 3,
    factor: 2,
    minTimeout: 1000,
    maxTimeout: 10000,
    randomize: true,
  });

  return new Promise((resolve) => {
    operation.attempt(async (currentAttempt) => {
      try {
        console.log(`Attempting LIFF authentication (attempt ${currentAttempt})`);

        const response = await fetch(`${process.env.NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT}/line/liff-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken }),
        });

        if (!response.ok) {
          throw new Error(`LIFF authentication failed: ${response.status}`);
        }

        const { customToken, profile }: LIFFLoginResponse = await response.json();

        const { user } = await signInWithCustomToken(auth, customToken);
        await updateProfile(user, {
          displayName: profile.displayName,
          photoURL: profile.pictureUrl,
        });

        console.log('LIFF authentication successful');
        resolve(true);
      } catch (error) {
        const categorizedError = categorizeFirebaseError(error);

        console.error(`LIFF authentication error (attempt ${currentAttempt}):`, {
          type: categorizedError.type,
          message: categorizedError.message,
          error,
          retryable: categorizedError.retryable
        });

        if (!categorizedError.retryable || !operation.retry(error as Error)) {
          console.error('LIFF authentication failed after all retries');

          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:error', {
              detail: {
                source: 'liff',
                errorType: categorizedError.type,
                errorMessage: categorizedError.message,
                originalError: error
              }
            }));
          }

          resolve(false);
        }
      }
    });
  });
};

let recaptchaVerifier: RecaptchaVerifier | null = null;
let recaptchaContainerElement: HTMLElement | null = null;

export const clearRecaptcha = () => {
  try {
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }

    if (recaptchaContainerElement) {
      if (document.getElementById("recaptcha-container")) {
        const iframes = recaptchaContainerElement.querySelectorAll("iframe");
        iframes.forEach((iframe) => iframe.remove());

        const divs = recaptchaContainerElement.querySelectorAll('div[id^="rc-"]');
        divs.forEach((div) => div.remove());
      }
      recaptchaContainerElement = null;
    }
  } catch (e) {
    console.error("Error clearing reCAPTCHA:", e);
  }
};

export const startPhoneNumberVerification = async (phoneNumber: string): Promise<string> => {
  try {
    clearRecaptcha();

    recaptchaContainerElement = document.getElementById("recaptcha-container");
    if (!recaptchaContainerElement) {
      throw new Error("reCAPTCHA container element not found");
    }

    recaptchaVerifier = new RecaptchaVerifier(phoneAuth, "recaptcha-container", {
      size: "invisible",
      callback: () => {
      },
      "expired-callback": () => {
        clearRecaptcha();
      },
    });

    await recaptchaVerifier.render();

    const confirmationResult = await signInWithPhoneNumber(
      phoneAuth,
      phoneNumber,
      recaptchaVerifier,
    );

    phoneVerificationState.phoneNumber = phoneNumber;
    phoneVerificationState.verificationId = confirmationResult.verificationId;

    return confirmationResult.verificationId;
  } catch (error) {
    console.error("Phone verification failed:", error);
    throw error;
  }
};

export const verifyPhoneCode = async (verificationId: string, code: string): Promise<boolean> => {
  try {
    console.log("Starting phone verification with code, using phoneAuth instance (no tenant)");

    if (!verificationId || !code) {
      console.error("Missing verificationId or code");
      return false;
    }

    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      console.log("Successfully created phone credential");

      try {
        console.log("Signing in with credential to get user ID");
        const userCredential = await signInWithCredential(phoneAuth, credential);
        console.log("Phone sign-in successful with credential");

        if (userCredential.user) {
          phoneVerificationState.phoneUid = userCredential.user.uid;
          console.log("Stored phone UID:", phoneVerificationState.phoneUid);

          const idToken = await userCredential.user.getIdToken();
          const refreshToken = userCredential.user.refreshToken;

          phoneVerificationState.authToken = idToken;
          phoneVerificationState.refreshToken = refreshToken;

          const tokenResult = await userCredential.user.getIdTokenResult();
          const expirationTime = new Date(tokenResult.expirationTime);
          phoneVerificationState.tokenExpiresAt = expirationTime;

          console.log("Extracted phone auth tokens successfully");
        } else {
          console.error("No user returned from signInWithCredential");
        }

        await phoneAuth.signOut();
        console.log("Signed out of phone auth");
      } catch (signInError) {
        console.warn("Could not sign in with phone credential:", signInError);

        try {
          console.log("Attempting fallback with signInWithPhoneNumber");
          const result = await signInWithPhoneNumber(
            phoneAuth,
            phoneVerificationState.phoneNumber || "",
            recaptchaVerifier!,
          );

          if (phoneAuth.currentUser) {
            phoneVerificationState.phoneUid = phoneAuth.currentUser.uid;
            console.log("Stored phone UID from fallback:", phoneVerificationState.phoneUid);

            const idToken = await phoneAuth.currentUser.getIdToken();
            const refreshToken = phoneAuth.currentUser.refreshToken;

            phoneVerificationState.authToken = idToken;
            phoneVerificationState.refreshToken = refreshToken;

            const tokenResult = await phoneAuth.currentUser.getIdTokenResult();
            const expirationTime = new Date(tokenResult.expirationTime);
            phoneVerificationState.tokenExpiresAt = expirationTime;

            console.log("Extracted phone auth tokens successfully (fallback)");
          }

          await phoneAuth.signOut();
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
        }
      }

      phoneVerificationState.verified = true;
      console.log("Phone verification state set to verified:", phoneVerificationState);
      return true;
    } catch (credentialError) {
      console.error("Invalid verification code:", credentialError);
      return false;
    }
  } catch (error) {
    console.error("Code verification failed:", error);
    return false;
  }
};

export const isPhoneVerified = (): boolean => {
  return phoneVerificationState.verified;
};

export const getVerifiedPhoneNumber = (): string | null => {
  return phoneVerificationState.verified ? phoneVerificationState.phoneNumber : null;
};

export const refreshAuthToken = async (user: any): Promise<string | null> => {
  const operation = retry.operation({
    retries: 3,
    factor: 2,
    minTimeout: 1000,
    maxTimeout: 10000,
    randomize: true,
  });

  return new Promise((resolve) => {
    operation.attempt(async (currentAttempt) => {
      try {
        console.log(`Attempting to refresh auth token (attempt ${currentAttempt})`);

        const idToken = await user.getIdToken(true);
        console.log('Token refresh successful');

        resolve(idToken);
      } catch (error) {
        const categorizedError = categorizeFirebaseError(error);

        console.error(`Token refresh error (attempt ${currentAttempt}):`, {
          type: categorizedError.type,
          message: categorizedError.message,
          error,
          retryable: categorizedError.retryable
        });

        if (!categorizedError.retryable || !operation.retry(error as Error)) {
          console.error('Token refresh failed after all retries');

          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:token-refresh-failed', {
              detail: {
                source: 'token-refresh',
                errorType: categorizedError.type,
                errorMessage: categorizedError.message,
                originalError: error
              }
            }));
          }

          resolve(null);
        }
      }
    });
  });
};

/**
 * Attempts to refresh the authentication token with proper error handling and retry mechanism
 * @returns The new ID token if successful, or null if failed
 */
export const refreshIdToken = async (): Promise<string | null> => {
  try {
    if (!auth.currentUser) {
      console.warn('Cannot refresh token: No authenticated user');
      return null;
    }

    return await refreshAuthToken(auth.currentUser);
  } catch (error) {
    console.error('Failed to refresh ID token:', error);
    return null;
  }
};

/**
 * Attempts to refresh the phone authentication token with proper error handling and retry mechanism
 * @returns The new phone ID token if successful, or null if failed
 */
export const refreshPhoneIdToken = async (): Promise<string | null> => {
  try {
    if (!phoneAuth.currentUser) {
      console.warn('Cannot refresh phone token: No authenticated user');
      return null;
    }

    return await refreshAuthToken(phoneAuth.currentUser);
  } catch (error) {
    console.error('Failed to refresh phone ID token:', error);
    return null;
  }
};
