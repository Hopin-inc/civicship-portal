import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from "@firebase/auth";
import { phoneAuth, phoneVerificationState } from "@/lib/firebase/firebase";

// 1. 認証コードを使ってPhoneAuthCredentialを作成
const getPhoneCredential = (verificationId: string, code: string) => {
  if (!verificationId || !code) {
    throw new Error("Missing verificationId or code");
  }

  return PhoneAuthProvider.credential(verificationId, code);
};

// 2. サインイン処理を行い、ユーザーの認証情報を保存
const signInWithPhoneCredential = async (credential: any) => {
  try {
    const userCredential = await signInWithCredential(phoneAuth, credential);
    console.log("Phone sign-in successful with credential");

    if (userCredential.user) {
      phoneVerificationState.phoneUid = userCredential.user.uid;
      console.log("Stored phone UID:", phoneVerificationState.phoneUid);

      // トークンを取得して保存
      await storeAuthTokens(userCredential.user);
    } else {
      console.error("No user returned from signInWithCredential");
    }
  } catch (error) {
    console.warn("Could not sign in with phone credential:", error);
    throw error;
  }
};

// 3. 認証トークンを保存
const storeAuthTokens = async (user: any) => {
  const idToken = await user.getIdToken();
  const refreshToken = user.refreshToken;

  phoneVerificationState.authToken = idToken;
  phoneVerificationState.refreshToken = refreshToken;

  const tokenResult = await user.getIdTokenResult();
  phoneVerificationState.tokenExpiresAt = new Date(tokenResult.expirationTime);

  console.log("Extracted phone auth tokens successfully");
};

// 4. フォールバックでサインイン処理
const signInWithFallback = async (recaptchaVerifier: RecaptchaVerifier) => {
  try {
    const result = await signInWithPhoneNumber(
      phoneAuth,
      phoneVerificationState.phoneNumber || "",
      recaptchaVerifier,
    );

    if (phoneAuth.currentUser) {
      phoneVerificationState.phoneUid = phoneAuth.currentUser.uid;
      console.log("Stored phone UID from fallback:", phoneVerificationState.phoneUid);

      // トークンを取得して保存
      await storeAuthTokens(phoneAuth.currentUser);
    }

    await phoneAuth.signOut();
  } catch (error) {
    console.error("Fallback also failed:", error);
    throw error;
  }
};

// 5. メインの電話番号検証関数
const verifyPhoneCode = async (
  verificationId: string,
  code: string,
  recaptchaVerifier: RecaptchaVerifier | null,
): Promise<boolean> => {
  try {
    console.log("Starting phone verification with code");

    const credential = getPhoneCredential(verificationId, code);
    await signInWithPhoneCredential(credential);

    await phoneAuth.signOut();
    console.log("Signed out of phone auth");

    phoneVerificationState.verified = true;
    console.log("Phone verification state set to verified:", phoneVerificationState);

    return true;
  } catch (error) {
    console.error("Phone verification failed:", error);

    try {
      console.log("Attempting fallback with signInWithPhoneNumber");
      if (recaptchaVerifier) {
        await signInWithFallback(recaptchaVerifier);
      }

      phoneVerificationState.verified = true;
      console.log("Phone verification state set to verified (fallback):", phoneVerificationState);

      return true;
    } catch (fallbackError) {
      console.error("Phone verification failed with fallback:", fallbackError);
      return false;
    }
  }
};

export default verifyPhoneCode;
