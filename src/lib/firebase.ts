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

const lineProvider = new OAuthProvider("oidc.line");
export const signInWithLine = async () => {
  return signInWithPopup(auth, lineProvider);
};

const facebookProvider = new FacebookAuthProvider();
export const signInWithFacebook = async () => {
  return signInWithPopup(auth, facebookProvider);
};
