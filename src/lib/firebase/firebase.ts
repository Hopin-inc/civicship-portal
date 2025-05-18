import { initializeApp } from "firebase/app";
import { getAuth, PhoneAuthProvider } from "@firebase/auth";

const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.tenantId = process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID ?? null;

const phoneApp = initializeApp(firebaseConfig, "phone-auth-app");
const phoneAuth = getAuth(phoneApp);
phoneAuth.tenantId = null;

export { app, auth, phoneAuth, phoneApp, PhoneAuthProvider };
