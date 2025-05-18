import { RecaptchaVerifier, signInWithPhoneNumber } from "@firebase/auth";
import { phoneAuth } from "@/lib/firebase/firebase";
import clearRecaptcha from "@/contexts/auth/reCAPTCHA/clearRecaptcha";

// 1. reCAPTCHAの初期化
const initializeRecaptcha = (
  recaptchaVerifier: RecaptchaVerifier | null,
  recaptchaContainerElement: HTMLElement | null,
) => {
  recaptchaVerifier = new RecaptchaVerifier(phoneAuth, "recaptcha-container", {
    size: "invisible",
    callback: () => {
      console.log("reCAPTCHA solved!");
    },
    "expired-callback": () => {
      console.log("reCAPTCHA expired");
      clearRecaptcha();
    },
  });

  return recaptchaVerifier;
};

// 2. reCAPTCHAのレンダリング
const renderRecaptcha = async (recaptchaVerifier: RecaptchaVerifier | null) => {
  try {
    await recaptchaVerifier?.render();
    console.log("reCAPTCHA rendered");
  } catch (error) {
    console.error("Error rendering reCAPTCHA:", error);
    throw new Error("reCAPTCHA rendering failed");
  }
};

// 3. 電話番号検証の開始
const startPhoneNumberVerification = async (
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier | null,
  recaptchaContainerElement: HTMLElement | null,
): Promise<string> => {
  try {
    // clearRecaptchaを呼び出して、以前のreCAPTCHA状態をクリア
    clearRecaptcha();

    recaptchaContainerElement = document.getElementById("recaptcha-container");
    if (!recaptchaContainerElement) {
      throw new Error("reCAPTCHA container element not found");
    }

    // reCAPTCHAの初期化とレンダリング
    recaptchaVerifier = initializeRecaptcha(recaptchaVerifier, recaptchaContainerElement);
    await renderRecaptcha(recaptchaVerifier);

    // 電話番号認証を実行
    const confirmationResult = await signInWithPhoneNumber(
      phoneAuth,
      phoneNumber,
      recaptchaVerifier,
    );

    console.log("Phone number verification started successfully");
    return confirmationResult.verificationId;
  } catch (error) {
    console.error("Phone verification failed:", error);
    throw error; // エラーを再スロー
  }
};

export default startPhoneNumberVerification;
