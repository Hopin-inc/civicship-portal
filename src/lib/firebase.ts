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
  linkWithCredential,
  UserCredential,
  fetchSignInMethodsForEmail as firebaseFetchSignInMethodsForEmail,
} from "@firebase/auth";
import { LIFFLoginResponse } from "@/types/line";

export const app = initializeApp({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
});

export const auth = getAuth(app);
auth.tenantId = process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID ?? null;

export const switchTenant = (tenantId: string | null) => {
  auth.tenantId = tenantId;
  return auth;
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
  switchTenant(null);
  
  try {
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }
    
    recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      size: 'normal', // 'invisible'から'normal'に変更
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
    }, auth);
    
    await recaptchaVerifier.render();
    
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult.verificationId;
  } catch (error) {
    console.error("Phone verification failed:", error);
    throw error;
  } finally {
    switchTenant(process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID);
  }
};

export const verifyPhoneCode = async (verificationId: string, code: string): Promise<UserCredential> => {
  switchTenant(null);
  
  try {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    // PhoneAuthProvider.credential doesn't have a token property
    return signInWithCredential(auth, credential);
  } catch (error) {
    console.error("Code verification failed:", error);
    throw error;
  } finally {
    switchTenant(process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID);
  }
};

export const linkPhoneCredential = async (verificationId: string, code: string): Promise<UserCredential> => {
  if (!auth.currentUser) {
    throw new Error("No user is signed in");
  }
  
  const credential = PhoneAuthProvider.credential(verificationId, code);
  return linkWithCredential(auth.currentUser, credential);
};

export const fetchSignInMethodsForEmail = async (email: string): Promise<string[]> => {
  return firebaseFetchSignInMethodsForEmail(auth, email);
};
