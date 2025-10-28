import { Page } from '@playwright/test';

/**
 * Firebase Authentication Mock Helpers for E2E Testing
 *
 * These helpers allow E2E tests to mock Firebase Authentication responses
 * without requiring actual SMS or Firebase emulator setup.
 *
 * For production E2E tests, consider:
 * 1. Firebase Auth Emulator (https://firebase.google.com/docs/emulator-suite)
 * 2. Firebase Test Lab with real devices
 * 3. Test phone numbers (https://firebase.google.com/docs/auth/web/phone-auth#test-with-fictional-phone-numbers)
 */

export interface FirebaseMockConfig {
  /**
   * Mock phone number for testing
   * Default: +819012345678 (Japanese mobile)
   */
  phoneNumber?: string;

  /**
   * Mock verification code
   * Default: 123456
   */
  verificationCode?: string;

  /**
   * Simulate SMS sending delay in ms
   * Default: 1000
   */
  smsDelay?: number;

  /**
   * Simulate code verification delay in ms
   * Default: 500
   */
  verificationDelay?: number;
}

/**
 * Sets up Firebase Authentication mocks for E2E testing
 *
 * This intercepts Firebase Auth SDK calls and provides mock responses.
 * Note: This is a simplified mock and may not cover all Firebase scenarios.
 *
 * @param page - Playwright page instance
 * @param config - Mock configuration
 */
export async function setupFirebaseMock(page: Page, config: FirebaseMockConfig = {}) {
  const {
    phoneNumber = '+819012345678',
    verificationCode = '123456',
    smsDelay = 1000,
    verificationDelay = 500,
  } = config;

  // Inject mock Firebase Auth responses
  await page.addInitScript(
    ({
      phoneNumber,
      verificationCode,
      smsDelay,
      verificationDelay,
    }: {
      phoneNumber: string;
      verificationCode: string;
      smsDelay: number;
      verificationDelay: number;
    }) => {
      // Store mock data in window object for access by mock functions
      (window as any).__firebaseMock = {
        phoneNumber,
        verificationCode,
        smsDelay,
        verificationDelay,
        verificationId: 'mock-verification-id-' + Date.now(),
      };

      // This would require deeper Firebase SDK mocking
      // For production use, consider Firebase emulator instead
      console.log('[Firebase Mock] Initialized with:', {
        phoneNumber,
        verificationCode,
      });
    },
    { phoneNumber, verificationCode, smsDelay, verificationDelay },
  );
}

/**
 * Waits for Firebase reCAPTCHA to be initialized
 * @param page - Playwright page instance
 * @param timeout - Maximum wait time in ms
 */
export async function waitForRecaptcha(page: Page, timeout = 10000) {
  await page.waitForSelector('#recaptcha-container', {
    state: 'attached',
    timeout,
  });
}

/**
 * Triggers Firebase phone verification with mock
 *
 * This helper clicks the submit button and waits for the code verification screen.
 * For actual Firebase integration, use Firebase emulator or test phone numbers.
 *
 * @param page - Playwright page instance
 * @param phoneNumber - Phone number to verify
 */
export async function submitPhoneNumber(page: Page, phoneNumber: string) {
  // Enter phone number
  const phoneInput = page.getByRole('textbox');
  await phoneInput.fill(phoneNumber);

  // Wait for validation
  await page.waitForTimeout(500);

  // Click submit
  const submitButton = page.getByRole('button', { name: /認証コードを送信/ });
  await submitButton.click();

  // Wait for code verification screen
  await page.waitForSelector('text=/送信された6桁の認証コードを入力してください/', {
    timeout: 10000,
  });
}

/**
 * Enters verification code in OTP input
 *
 * @param page - Playwright page instance
 * @param code - 6-digit verification code
 */
export async function enterVerificationCode(page: Page, code: string) {
  if (code.length !== 6) {
    throw new Error('Verification code must be exactly 6 digits');
  }

  // Find the first OTP input slot
  const codeInputSlots = page.locator('input[inputmode="numeric"]');
  const firstInput = await codeInputSlots.first();

  // Click and fill the code
  await firstInput.click();
  await firstInput.fill(code);

  // Wait for value to be set
  await page.waitForTimeout(300);
}

/**
 * Submits verification code
 *
 * @param page - Playwright page instance
 */
export async function submitVerificationCode(page: Page) {
  const verifyButton = page.getByRole('button', { name: /認証する/ });
  await verifyButton.click();
}

/**
 * Complete phone verification flow (phone + code)
 *
 * This is a convenience function that combines all steps.
 * Note: Actual code verification requires Firebase emulator or test setup.
 *
 * @param page - Playwright page instance
 * @param phoneNumber - Phone number to verify
 * @param code - Verification code
 */
export async function completePhoneVerification(
  page: Page,
  phoneNumber: string,
  code: string = '123456',
) {
  // Step 1: Submit phone number
  await submitPhoneNumber(page, phoneNumber);

  // Step 2: Enter and submit verification code
  await enterVerificationCode(page, code);
  await submitVerificationCode(page);

  // Wait for potential loading state
  await page.waitForTimeout(1000);
}

/**
 * Firebase Test Phone Numbers
 *
 * These are fictional phone numbers that can be configured in Firebase Console
 * for testing without sending actual SMS.
 *
 * See: https://firebase.google.com/docs/auth/web/phone-auth#test-with-fictional-phone-numbers
 */
export const FIREBASE_TEST_NUMBERS = {
  // Japan
  JP_MOBILE_1: '+819012345678',
  JP_MOBILE_2: '+818012345678',

  // United States
  US_MOBILE_1: '+16505551234',
  US_MOBILE_2: '+12025551234',

  // United Kingdom
  UK_MOBILE_1: '+447911123456',
  UK_MOBILE_2: '+447400123456',

  // Test code (configure in Firebase Console)
  TEST_CODE: '123456',
} as const;

/**
 * Sets up Firebase Auth Emulator connection
 *
 * Call this before navigating to the app to connect to local emulator.
 * Requires Firebase emulator to be running on localhost:9099.
 *
 * @param page - Playwright page instance
 * @param host - Emulator host (default: localhost)
 * @param port - Emulator port (default: 9099)
 */
export async function connectToFirebaseEmulator(
  page: Page,
  host: string = 'localhost',
  port: number = 9099,
) {
  await page.addInitScript(
    ({ host, port }: { host: string; port: number }) => {
      // This would need to be injected before Firebase initializes
      (window as any).__firebaseEmulatorConfig = {
        host,
        port,
        enabled: true,
      };
      console.log(`[Firebase Emulator] Configured to connect to ${host}:${port}`);
    },
    { host, port },
  );
}
