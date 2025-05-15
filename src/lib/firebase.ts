import { initializeApp } from "firebase/app";
import {
  FacebookAuthProvider,
  getAuth,
  OAuthProvider,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithCustomToken,
  signInWithPhoneNumber,
  signInWithPopup,
  updateProfile,
} from "@firebase/auth";
import { LIFFLoginResponse } from "@/types/line";
import { Analytics, getAnalytics, isSupported } from "@firebase/analytics";

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

let analytics: Analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
export { analytics };

export const phoneApp = initializeApp(firebaseConfig, "phone-auth-app");
export const phoneAuth = getAuth(phoneApp);
phoneAuth.tenantId = null;

type PhoneVerificationState = {
  phoneNumber: string | null;
  verificationId: string | null;
  verified: boolean;
  phoneUid: string | null;
};

export const phoneVerificationState: PhoneVerificationState = {
  phoneNumber: null,
  verificationId: null,
  verified: false,
  phoneUid: null,
};

const providers = {
  line: new OAuthProvider("oidc.line"),
  facebook: new FacebookAuthProvider(),
};

const signIn = async (provider: keyof typeof providers) => {
  try {
    return signInWithPopup(auth, providers[provider]);
  } catch (error) {
    console.error(JSON.stringify(error));
  }
};

export const signInWithLine = async () => {
  return signIn("line");
};

export const signInWithFacebook = async () => {
  return signIn("facebook");
};

export const signInWithLiffToken = async (accessToken: string): Promise<boolean> => {
  try {
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
    return true;
  } catch (error) {
    console.error("Authentication with LIFF token failed:", error);
    return false;
  }
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
        console.log("reCAPTCHA solved!");
      },
      "expired-callback": () => {
        console.log("reCAPTCHA expired");
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
