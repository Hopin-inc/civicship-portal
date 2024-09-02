import { initializeApp } from "firebase/app";
import {
  getAuth,
  OAuthProvider,
  signInWithRedirect,
} from "@firebase/auth";

export const app = initializeApp({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
});

export const auth = getAuth(app);

const lineProvider = new OAuthProvider("oidc.line");
export const signInWithLine = async () => {
  await signInWithRedirect(auth, lineProvider);
};
