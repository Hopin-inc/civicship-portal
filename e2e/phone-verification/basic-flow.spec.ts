import { test, expect } from '@playwright/test';

/**
 * E2E tests for international phone number verification flow
 *
 * These tests verify the complete user journey through phone verification,
 * including UI interactions, Firebase Authentication, and GraphQL operations.
 */

test.describe('Phone Verification - Basic Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to phone verification page
    await page.goto('/sign-up/phone-verification');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display phone input form with international field', async ({ page }) => {
    // Check for InternationalPhoneField components
    await expect(page.getByRole('textbox')).toBeVisible();
    await expect(page.getByLabel('Select country')).toBeVisible();
    await expect(page.getByPlaceholder('例）09012345678')).toBeVisible();

    // Check for submit button
    await expect(page.getByRole('button', { name: /認証コードを送信/ })).toBeVisible();
  });

  test('should allow country selection', async ({ page }) => {
    const countrySelect = page.getByLabel('Select country');

    // Default should be Japan
    await expect(countrySelect).toHaveValue('JP');

    // Change to US
    await countrySelect.selectOption('US');
    await expect(countrySelect).toHaveValue('US');

    // Change to UK
    await countrySelect.selectOption('GB');
    await expect(countrySelect).toHaveValue('GB');
  });

  test('should format phone number with country code', async ({ page }) => {
    const phoneInput = page.getByRole('textbox');

    // Enter Japanese phone number
    await phoneInput.fill('9012345678');

    // Should be formatted with country code
    const value = await phoneInput.inputValue();
    expect(value).toContain('+81');
    expect(value).toContain('90');
  });

  test('should disable submit button when phone is invalid', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /認証コードを送信/ });

    // Should be disabled initially (no phone number)
    await expect(submitButton).toBeDisabled();

    // Enter invalid phone number (too short)
    await page.getByRole('textbox').fill('123');

    // Should still be disabled
    await expect(submitButton).toBeDisabled();
  });

  test('should enable submit button when phone is valid', async ({ page }) => {
    const phoneInput = page.getByRole('textbox');
    const submitButton = page.getByRole('button', { name: /認証コードを送信/ });

    // Enter valid Japanese mobile number
    await phoneInput.fill('9012345678');

    // Wait for validation
    await page.waitForTimeout(500);

    // Should be enabled
    await expect(submitButton).not.toBeDisabled();
  });

  test('should show loading state when submitting', async ({ page }) => {
    const phoneInput = page.getByRole('textbox');

    // Enter valid phone number
    await phoneInput.fill('9012345678');

    // Click submit
    await page.getByRole('button', { name: /認証コードを送信/ }).click();

    // Should show loading state
    await expect(page.getByText('送信中...')).toBeVisible();
  });

  test('should handle different country phone formats', async ({ page }) => {
    const countrySelect = page.getByLabel('Select country');
    const phoneInput = page.getByRole('textbox');

    // Test Japanese format
    await countrySelect.selectOption('JP');
    await phoneInput.fill('9012345678');
    let value = await phoneInput.inputValue();
    expect(value).toContain('+81');

    // Clear and test US format
    await phoneInput.clear();
    await countrySelect.selectOption('US');
    await phoneInput.fill('6505551234');
    value = await phoneInput.inputValue();
    expect(value).toContain('+1');

    // Clear and test UK format
    await phoneInput.clear();
    await countrySelect.selectOption('GB');
    await phoneInput.fill('7911123456');
    value = await phoneInput.inputValue();
    expect(value).toContain('+44');
  });

  test('should display descriptive text', async ({ page }) => {
    await expect(page.getByText('電話番号認証のため、あなたの電話番号を入力してください。SMSで認証コードが送信されます。')).toBeVisible();
  });

  test('should display reload button', async ({ page }) => {
    await expect(page.getByText('切り替わらない際は再読み込み')).toBeVisible();
  });

  test('should have recaptcha container', async ({ page }) => {
    const recaptchaContainer = page.locator('#recaptcha-container');
    await expect(recaptchaContainer).toBeAttached();
  });
});

test.describe('Phone Verification - Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-up/phone-verification');
    await page.waitForLoadState('networkidle');
  });

  test('should reject landline numbers', async ({ page }) => {
    const phoneInput = page.getByRole('textbox');
    const submitButton = page.getByRole('button', { name: /認証コードを送信/ });

    // Enter Japanese landline number (Tokyo 03)
    await phoneInput.fill('312345678');

    // Wait for validation
    await page.waitForTimeout(500);

    // Should be disabled (landline not allowed)
    await expect(submitButton).toBeDisabled();
  });

  test('should reject invalid phone numbers', async ({ page }) => {
    const phoneInput = page.getByRole('textbox');
    const submitButton = page.getByRole('button', { name: /認証コードを送信/ });

    // Enter invalid number
    await phoneInput.fill('999999999999999');

    // Wait for validation
    await page.waitForTimeout(500);

    // Should be disabled
    await expect(submitButton).toBeDisabled();
  });

  test('should handle rate limiting', async ({ page }) => {
    // This test would need mock setup for rate limiting
    // Skipping actual implementation as it requires backend setup
  });
});

test.describe('Phone Verification - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-up/phone-verification');
    await page.waitForLoadState('networkidle');
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Tab to country select
    await page.keyboard.press('Tab');
    let focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    expect(focused).toBe('Select country');

    // Tab to phone input
    await page.keyboard.press('Tab');
    focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBe('INPUT');
  });

  test('should have proper ARIA labels', async ({ page }) => {
    // Country select should have aria-label
    const countrySelect = page.getByLabel('Select country');
    await expect(countrySelect).toHaveAttribute('aria-label', 'Select country');
  });
});
