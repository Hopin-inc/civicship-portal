import { initializeApp } from "firebase/app";
import { getAuth } from "@firebase/auth";

const app = initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID,
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
});

export const auth = getAuth(app);
