import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from "@firebase/auth";
import { phoneAuth } from "@/lib/firebase/firebase";

export type PhoneVerificationResult = {
  success: boolean;
  phoneUid: string | null;
  authToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: Date | null;
};

// 1. 認証コードを使ってPhoneAuthCredentialを作成
const getPhoneCredential = (verificationId: string, code: string) => {
  if (!verificationId || !code) {
    throw new Error("Missing verificationId or code");
  }

  return PhoneAuthProvider.credential(verificationId, code);
};

// 2. サインイン処理を行い、ユーザーの認証情報を保存
const signInWithPhoneCredential = async (credential: any): Promise<PhoneVerificationResult> => {
  try {
    const userCredential = await signInWithCredential(phoneAuth, credential);
    console.log("Phone sign-in successful with credential");

    if (userCredential.user) {
      const phoneUid = userCredential.user.uid;
      console.log("Obtained phone UID:", phoneUid);

      // トークンを取得して保存
      const tokens = await storeAuthTokens(userCredential.user);
      
      return {
        success: true,
        phoneUid,
        ...tokens
      };
    } else {
      console.error("No user returned from signInWithCredential");
      return {
        success: false,
        phoneUid: null,
        authToken: null,
        refreshToken: null,
        tokenExpiresAt: null
      };
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
  const tokenResult = await user.getIdTokenResult();
  const tokenExpiresAt = new Date(tokenResult.expirationTime);

  console.log("Extracted phone auth tokens successfully");
  
  return {
    authToken: idToken,
    refreshToken: refreshToken,
    tokenExpiresAt: tokenExpiresAt
  };
};

// 4. フォールバックでサインイン処理
const signInWithFallback = async (
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<PhoneVerificationResult> => {
  try {
    const result = await signInWithPhoneNumber(
      phoneAuth,
      phoneNumber,
      recaptchaVerifier,
    );

    if (phoneAuth.currentUser) {
      const phoneUid = phoneAuth.currentUser.uid;
      console.log("Stored phone UID from fallback:", phoneUid);

      // トークンを取得して保存
      const tokens = await storeAuthTokens(phoneAuth.currentUser);
      
      await phoneAuth.signOut();
      
      return {
        success: true,
        phoneUid,
        ...tokens
      };
    }
    
    await phoneAuth.signOut();
    
    return {
      success: false,
      phoneUid: null,
      authToken: null,
      refreshToken: null,
      tokenExpiresAt: null
    };
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
  phoneNumber: string = ""
): Promise<PhoneVerificationResult> => {
  try {
    console.log("Starting phone verification with code");

    const credential = getPhoneCredential(verificationId, code);
    const result = await signInWithPhoneCredential(credential);

    await phoneAuth.signOut();
    console.log("Signed out of phone auth");
    
    return {
      ...result,
      success: true
    };
  } catch (error) {
    console.error("Phone verification failed:", error);

    try {
      console.log("Attempting fallback with signInWithPhoneNumber");
      if (recaptchaVerifier && phoneNumber) {
        const fallbackResult = await signInWithFallback(phoneNumber, recaptchaVerifier);
        return fallbackResult;
      }
      
      return {
        success: false,
        phoneUid: null,
        authToken: null,
        refreshToken: null,
        tokenExpiresAt: null
      };
    } catch (fallbackError) {
      console.error("Phone verification failed with fallback:", fallbackError);
      return {
        success: false,
        phoneUid: null,
        authToken: null,
        refreshToken: null,
        tokenExpiresAt: null
      };
    }
  }
};

export default verifyPhoneCode;
