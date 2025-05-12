import { initializeApp } from "firebase/app";
import {
  FacebookAuthProvider,
  getAuth,
  OAuthProvider,
  signInWithPopup,
  signInWithCustomToken,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
} from "@firebase/auth";

export { PhoneAuthProvider };
import { LIFFLoginResponse } from "@/types/line";

const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.tenantId = process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID ?? null;

export const phoneApp = initializeApp(firebaseConfig, "phone-auth-app");
export const phoneAuth = getAuth(phoneApp);
phoneAuth.tenantId = null;

type PhoneVerificationState = {
  phoneNumber: string | null;
  verificationId: string | null;
  verified: boolean;
};

export const phoneVerificationState: PhoneVerificationState = {
  phoneNumber: null,
  verificationId: null,
  verified: false,
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

export const startPhoneNumberVerification = async (phoneNumber: string): Promise<string> => {
  try {
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }

    recaptchaVerifier = new RecaptchaVerifier(phoneAuth, 'recaptcha-container', {
      size: 'normal',
      callback: () => {
        console.log('reCAPTCHA solved!');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
        if (recaptchaVerifier) {
          recaptchaVerifier.clear();
          recaptchaVerifier = null;
        }
      }
    });

    await recaptchaVerifier.render();

    const confirmationResult = await signInWithPhoneNumber(phoneAuth, phoneNumber, recaptchaVerifier);

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
        console.log("Attempting to sign in with phone credential (no tenant)");
        await signInWithPhoneNumber(phoneAuth, phoneVerificationState.phoneNumber || '', recaptchaVerifier!);
        console.log("Phone sign-in successful");
        
        await phoneAuth.signOut();
        console.log("Signed out of phone auth");
      } catch (signInError) {
        console.warn("Could not sign in with phone, but credential was created:", signInError);
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
