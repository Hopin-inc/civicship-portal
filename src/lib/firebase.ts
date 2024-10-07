import { initializeApp } from "firebase/app";
import {
  FacebookAuthProvider,
  getAuth,
  OAuthProvider,
  signInWithPopup,
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
