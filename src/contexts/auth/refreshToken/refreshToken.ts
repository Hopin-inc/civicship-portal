import { auth, phoneAuth } from "@/lib/firebase/firebase";
import refreshAuthToken from "@/contexts/auth/refreshToken/index";

const refreshIdToken = async (): Promise<string | null> => {
  try {
    if (!auth.currentUser) {
      console.warn("Cannot refresh token: No authenticated user");
      return null;
    }

    return await refreshAuthToken(auth.currentUser);
  } catch (error) {
    console.error("Failed to refresh ID token:", error);
    return null;
  }
};

const refreshPhoneIdToken = async (): Promise<string | null> => {
  try {
    if (!phoneAuth.currentUser) {
      console.warn("Cannot refresh phone token: No authenticated user");
      return null;
    }

    return await refreshAuthToken(phoneAuth.currentUser);
  } catch (error) {
    console.error("Failed to refresh phone ID token:", error);
    return null;
  }
};

export { refreshIdToken, refreshPhoneIdToken };
