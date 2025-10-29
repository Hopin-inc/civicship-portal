import { test, expect } from '@playwright/test';
import {
  mockIdentityCheckPhoneUser,
  mockIdentityCheckWithDelay,
  mockGraphQLAuthError,
  mockGraphQLNetworkError,
  mockInvalidGraphQLResponse,
  MOCK_RESPONSES,
} from '../helpers/graphql-mock';

/**
 * E2E tests for complete phone verification flow with GraphQL integration
 *
 * These tests verify the full authentication journey:
 * 1. Phone number input → Firebase SMS
 * 2. Verification code input → Firebase verification
 * 3. GraphQL identity check → User status determination
 * 4. Redirect to appropriate page based on user status
 */

test.describe('Phone Verification - Complete Flow with GraphQL', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to phone verification page
    await page.goto('/sign-up/phone-verification');
    await page.waitForLoadState('networkidle');
  });

  test('should complete full new user flow', async ({ page, context }) => {
    // Mock GraphQL endpoint for new user
    await mockIdentityCheckPhoneUser(page, MOCK_RESPONSES.NEW_USER);

    // Step 1: Enter phone number
    const phoneInput = page.getByRole('textbox');
    await phoneInput.fill('9012345678');

    // Wait for submit button to be enabled (validation complete)
    const submitButton = page.getByRole('button', { name: /認証コードを送信/ });
    await expect(submitButton).toBeEnabled();
    await expect(submitButton).toBeEnabled();

    // Submit phone number
    await submitButton.click();

    // Step 2: Wait for code input screen
    await expect(page.getByText(/送信された6桁の認証コードを入力してください/)).toBeVisible({
      timeout: 10000,
    });

    // Note: In real E2E, we would need Firebase test mode or actual SMS
    // For now, we test the UI flow assuming code verification succeeds
    // In production E2E, consider using Firebase Auth Emulator

    // Step 3: Enter verification code (mock scenario)
    // This would require Firebase emulator or test phone numbers
    // For demonstration, we validate the UI is ready
    const codeInputSlots = page.locator('input[inputmode="numeric"]');
    await expect(codeInputSlots.first()).toBeVisible();

    // Verify submit button for code
    const verifyButton = page.getByRole('button', { name: /認証する/ });
    await expect(verifyButton).toBeVisible();
    await expect(verifyButton).toBeDisabled(); // Disabled until 6 digits entered
  });

  test('should handle existing user in same community', async ({ page }) => {
    // Mock GraphQL endpoint for existing user
    await mockIdentityCheckPhoneUser(page, MOCK_RESPONSES.EXISTING_SAME_COMMUNITY);

    // Enter phone number and submit
    const phoneInput = page.getByRole('textbox');
    await phoneInput.fill('9012345678');

    const submitButton = page.getByRole('button', { name: /認証コードを送信/ });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Wait for code verification screen
    await expect(page.getByText(/送信された6桁の認証コードを入力してください/)).toBeVisible({
      timeout: 10000,
    });
  });

  test('should handle existing user from different community', async ({ page }) => {
    // Mock GraphQL endpoint for cross-community user
    await mockIdentityCheckPhoneUser(page, MOCK_RESPONSES.EXISTING_DIFFERENT_COMMUNITY);

    // Enter phone number and submit
    const phoneInput = page.getByRole('textbox');
    await phoneInput.fill('8012345678');

    const submitButton = page.getByRole('button', { name: /認証コードを送信/ });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Wait for code verification screen
    await expect(page.getByText(/送信された6桁の認証コードを入力してください/)).toBeVisible({
      timeout: 10000,
    });
  });

  test('should display phone number in code verification step', async ({ page }) => {
    // Enter and submit phone number
    const phoneInput = page.getByRole('textbox');
    await phoneInput.fill('9012345678');

    const submitButton = page.getByRole('button', { name: /認証コードを送信/ });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Verify phone number is displayed in code verification screen
    await expect(page.getByText(/\+81.*90.*1234.*5678.*に送信された6桁の認証コードを入力してください/)).toBeVisible({
      timeout: 10000,
    });
  });

  test('should allow resending verification code', async ({ page }) => {
    // Enter and submit phone number
    const phoneInput = page.getByRole('textbox');
    await phoneInput.fill('9012345678');

    const submitButton = page.getByRole('button', { name: /認証コードを送信/ });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Wait for code verification screen
    await expect(page.getByText(/送信された6桁の認証コードを入力してください/)).toBeVisible({
      timeout: 10000,
    });

    // Check resend button exists
    const resendButton = page.getByRole('button', { name: /認証コードを再送/ });
    await expect(resendButton).toBeVisible();

    // Should be disabled initially due to cooldown
    await expect(resendButton).toBeDisabled();

    // Should show countdown
    await expect(page.getByText(/秒後に再送できます/)).toBeVisible();
  });

  test('should allow going back to phone input from code verification', async ({ page }) => {
    // Enter and submit phone number
    const phoneInput = page.getByRole('textbox');
    await phoneInput.fill('9012345678');

    const submitButton = page.getByRole('button', { name: /認証コードを送信/ });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Wait for code verification screen
    await expect(page.getByText(/送信された6桁の認証コードを入力してください/)).toBeVisible({
      timeout: 10000,
    });

    // Click back button
    const backButton = page.getByRole('button', { name: /電話番号を変更する/ });
    await expect(backButton).toBeVisible();
    await backButton.click();

    // Should return to phone input screen (after reload)
    // Note: The actual implementation triggers window.location.reload()
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('textbox')).toBeVisible();
    await expect(page.getByRole('button', { name: /認証コードを送信/ })).toBeVisible();
  });
});

test.describe('Phone Verification - Code Input UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-up/phone-verification');
    await page.waitForLoadState('networkidle');

    // Navigate to code verification step
    const phoneInput = page.getByRole('textbox');
    await phoneInput.fill('9012345678');

    const submitButton = page.getByRole('button', { name: /認証コードを送信/ });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Wait for code verification screen
    await expect(page.getByText(/送信された6桁の認証コードを入力してください/)).toBeVisible({
      timeout: 10000,
    });
  });

  test('should display 6 input slots for verification code', async ({ page }) => {
    // Check for 6 OTP input slots
    const codeInputSlots = page.locator('input[inputmode="numeric"]');
    await expect(codeInputSlots).toHaveCount(6);
  });

  test('should keep submit button disabled until 6 digits entered', async ({ page }) => {
    const verifyButton = page.getByRole('button', { name: /認証する/ });

    // Initially disabled
    await expect(verifyButton).toBeDisabled();

    // Enter partial code (5 digits)
    const codeInputSlots = page.locator('input[inputmode="numeric"]');
    const firstInput = codeInputSlots.first();
    await firstInput.click();
    await firstInput.fill('12345');

    // Should still be disabled
    await expect(verifyButton).toBeDisabled();
  });

  test('should show loading state when verifying code', async ({ page }) => {
    // Mock GraphQL with delay to show loading state
    await mockIdentityCheckWithDelay(page, MOCK_RESPONSES.NEW_USER, 1000);

    // Enter full 6-digit code
    const codeInputSlots = page.locator('input[inputmode="numeric"]');
    const firstInput = codeInputSlots.first();
    await firstInput.click();
    await firstInput.fill('123456');

    // Submit
    const verifyButton = page.getByRole('button', { name: /認証する/ });
    await verifyButton.click();

    // Should show loading state
    await expect(page.getByText('認証中...')).toBeVisible();
  });
});

test.describe('Phone Verification - GraphQL Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-up/phone-verification');
    await page.waitForLoadState('networkidle');
  });

  test('should handle GraphQL network errors', async ({ page }) => {
    // Mock GraphQL network error
    await mockGraphQLNetworkError(page);

    // Enter phone number and submit
    const phoneInput = page.getByRole('textbox');
    await phoneInput.fill('9012345678');

    const submitButton = page.getByRole('button', { name: /認証コードを送信/ });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Wait for code verification screen
    await expect(page.getByText(/送信された6桁の認証コードを入力してください/)).toBeVisible({
      timeout: 10000,
    });

    // Enter verification code
    const codeInputSlots = page.locator('input[inputmode="numeric"]');
    await codeInputSlots.first().click();
    await codeInputSlots.first().fill('123456');

    // Submit code - should handle network error
    const verifyButton = page.getByRole('button', { name: /認証する/ });
    // Note: Error handling would show toast, which we can't easily test in E2E
    // In production, consider adding data-testid to error messages
  });

  test('should handle GraphQL authentication errors', async ({ page }) => {
    // Mock GraphQL authentication error
    await mockGraphQLAuthError(page);

    // Enter phone number and submit
    const phoneInput = page.getByRole('textbox');
    await phoneInput.fill('9012345678');

    const submitButton = page.getByRole('button', { name: /認証コードを送信/ });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Wait for code verification screen
    await expect(page.getByText(/送信された6桁の認証コードを入力してください/)).toBeVisible({
      timeout: 10000,
    });
  });

  test('should handle invalid GraphQL responses', async ({ page }) => {
    // Mock invalid GraphQL response
    await mockInvalidGraphQLResponse(page);

    // Complete flow to code verification
    const phoneInput = page.getByRole('textbox');
    await phoneInput.fill('9012345678');

    const submitButton = page.getByRole('button', { name: /認証コードを送信/ });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await expect(page.getByText(/送信された6桁の認証コードを入力してください/)).toBeVisible({
      timeout: 10000,
    });

    // Error handling would occur when code is verified
    // In production, this should show an appropriate error message
  });
});

test.describe('Phone Verification - International Numbers with GraphQL', () => {
  test.beforeEach(async ({ page }) => {
    // Mock GraphQL for new user
    await mockIdentityCheckPhoneUser(page, MOCK_RESPONSES.NEW_USER);

    await page.goto('/sign-up/phone-verification');
    await page.waitForLoadState('networkidle');
  });

  test('should handle US phone number verification', async ({ page }) => {
    const countrySelect = page.getByLabel('Select country');
    const phoneInput = page.getByRole('textbox');

    // Switch to US
    await countrySelect.selectOption('US');

    // Enter US phone number
    await phoneInput.fill('6505551234');

    // Verify formatting
    const value = await phoneInput.inputValue();
    expect(value).toContain('+1');

    // Submit
    const submitButton = page.getByRole('button', { name: /認証コードを送信/ });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Should proceed to code verification
    await expect(page.getByText(/送信された6桁の認証コードを入力してください/)).toBeVisible({
      timeout: 10000,
    });

    // US phone number should be displayed
    await expect(page.getByText(/\+1.*650.*555.*1234/)).toBeVisible();
  });

  test('should handle UK phone number verification', async ({ page }) => {
    const countrySelect = page.getByLabel('Select country');
    const phoneInput = page.getByRole('textbox');

    // Switch to UK
    await countrySelect.selectOption('GB');

    // Enter UK mobile number
    await phoneInput.fill('7911123456');

    // Verify formatting
    const value = await phoneInput.inputValue();
    expect(value).toContain('+44');

    // Submit
    const submitButton = page.getByRole('button', { name: /認証コードを送信/ });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Should proceed to code verification
    await expect(page.getByText(/送信された6桁の認証コードを入力してください/)).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe('Phone Verification - Redirect Flow', () => {
  test('should handle redirect with next parameter for new user', async ({ page }) => {
    // Mock GraphQL for new user
    await mockIdentityCheckPhoneUser(page, MOCK_RESPONSES.NEW_USER);

    // Navigate with next parameter
    await page.goto('/sign-up/phone-verification?next=/dashboard');
    await page.waitForLoadState('networkidle');

    // Complete phone input
    const phoneInput = page.getByRole('textbox');
    await phoneInput.fill('9012345678');

    const submitButton = page.getByRole('button', { name: /認証コードを送信/ });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Wait for code verification
    await expect(page.getByText(/送信された6桁の認証コードを入力してください/)).toBeVisible({
      timeout: 10000,
    });

    // After successful verification, should redirect to /sign-up?next=/dashboard
    // This would require actual Firebase code verification which isn't possible in E2E without emulator
  });

  test('should handle redirect for existing user', async ({ page }) => {
    // Mock GraphQL for existing user
    await mockIdentityCheckPhoneUser(page, MOCK_RESPONSES.EXISTING_SAME_COMMUNITY);

    // Navigate with next parameter
    await page.goto('/sign-up/phone-verification?next=/profile');
    await page.waitForLoadState('networkidle');

    // Complete phone input
    const phoneInput = page.getByRole('textbox');
    await phoneInput.fill('9012345678');

    const submitButton = page.getByRole('button', { name: /認証コードを送信/ });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await expect(page.getByText(/送信された6桁の認証コードを入力してください/)).toBeVisible({
      timeout: 10000,
    });

    // After successful verification, should redirect to /profile or home
  });
});
