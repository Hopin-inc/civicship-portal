import { RecaptchaVerifier } from "@firebase/auth";

let recaptchaVerifier: RecaptchaVerifier | null = null;
let recaptchaContainerElement: HTMLElement | null = null;

const clearRecaptcha = () => {
  try {
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }

    if (recaptchaContainerElement) {
      if (document.getElementById("recaptcha-container")) {
        const iframes = recaptchaContainerElement.querySelectorAll("iframe");
        iframes.forEach((iframe) => iframe.remove());

        const divs = recaptchaContainerElement.querySelectorAll('div[id^="rc-"]');
        divs.forEach((div) => div.remove());
      }
      recaptchaContainerElement = null;
    }
  } catch (e) {
    console.error("Error clearing reCAPTCHA:", e);
  }
};

export default clearRecaptcha;
