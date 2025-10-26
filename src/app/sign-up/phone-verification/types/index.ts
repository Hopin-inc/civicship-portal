export type VerificationStep = "phone" | "code";

export interface PhoneVerificationState {
  phoneNumber: string;
  verificationCode: string;
  step: VerificationStep;
}

export interface PhoneVerificationLoadingState {
  isPhoneSubmitting: boolean;
  isCodeVerifying: boolean;
  isReloading: boolean;
  isRateLimited: boolean;
}

export interface PhoneValidationResult {
  isValid: boolean;
  formattedPhone: string;
  digitsOnly: string;
}

export interface PhoneSubmissionResult {
  success: boolean;
  error?: string;
}

export interface CodeVerificationResult {
  success: boolean;
  error?: string;
}
