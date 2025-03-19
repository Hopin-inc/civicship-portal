import { initializeApp } from "firebase/app";
import {
  FacebookAuthProvider,
  getAuth,
  OAuthProvider,
  signInWithPopup,
  signInWithCustomToken,
} from "@firebase/auth";

export const app = initializeApp({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
});

export const auth = getAuth(app);

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
    const response = await fetch("https://localhost:3000/line/liff-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken }),
    });

    if (!response.ok) {
      throw new Error(`LIFF authentication failed: ${response.status}`);
    }

    const { customToken } = await response.json();
    
    console.log("👏 customToken", customToken);
    
    await signInWithCustomToken(auth, customToken);
    return true;
  } catch (error) {
    console.error("Authentication with LIFF token failed:", error);
    return false;
  }
};
