# E2E Testing for Phone Verification

This directory contains end-to-end (E2E) tests for the international phone number verification feature, including Firebase Authentication and GraphQL integration.

## Overview

The E2E test suite covers:

1. **Basic UI Flow** (`phone-verification/basic-flow.spec.ts`)
   - Phone input form rendering and interactions
   - Country selection and phone number formatting
   - Form validation and error handling
   - Accessibility features

2. **Complete Authentication Flow** (`phone-verification/complete-flow.spec.ts`)
   - Full authentication journey from phone input to verification
   - GraphQL integration with `identityCheckPhoneUser` mutation
   - Different user scenarios (new user, existing user, cross-community)
   - Error handling and loading states

3. **Authentication Integration** (`phone-verification/auth-integration.spec.ts`)
   - Comprehensive integration between Firebase Auth and GraphQL
   - Code resend functionality
   - Session persistence
   - International phone number support

## Test Helpers

### Firebase Mock (`helpers/firebase-mock.ts`)

Provides utilities for mocking Firebase Authentication in E2E tests:

```typescript
import { submitPhoneNumber, enterVerificationCode, FIREBASE_TEST_NUMBERS } from './helpers/firebase-mock';

// Submit phone number
await submitPhoneNumber(page, FIREBASE_TEST_NUMBERS.JP_MOBILE_1.replace('+81', ''));

// Enter verification code
await enterVerificationCode(page, '123456');
```

**Key functions:**
- `setupFirebaseMock()` - Set up Firebase Auth mocks
- `submitPhoneNumber()` - Submit phone number and wait for code screen
- `enterVerificationCode()` - Enter 6-digit verification code
- `completePhoneVerification()` - Complete full flow
- `connectToFirebaseEmulator()` - Connect to Firebase emulator

### GraphQL Mock (`helpers/graphql-mock.ts`)

Provides utilities for mocking GraphQL API responses:

```typescript
import { mockIdentityCheckPhoneUser, MOCK_RESPONSES } from './helpers/graphql-mock';

// Mock new user scenario
await mockIdentityCheckPhoneUser(page, MOCK_RESPONSES.NEW_USER);

// Mock existing user
await mockIdentityCheckPhoneUser(page, MOCK_RESPONSES.EXISTING_SAME_COMMUNITY);
```

**Key functions:**
- `mockIdentityCheckPhoneUser()` - Mock identity check mutation
- `mockGraphQLAuthError()` - Mock authentication errors
- `mockGraphQLNetworkError()` - Mock network failures
- `mockIdentityCheckWithDelay()` - Test loading states
- `MOCK_RESPONSES` - Pre-defined response scenarios

## Running Tests

### Prerequisites

1. **Install Playwright:**
   ```bash
   pnpm add -D @playwright/test
   pnpm exec playwright install
   ```

2. **Ensure development server is running:**
   ```bash
   pnpm dev
   ```

### Run All E2E Tests

```bash
# Run all E2E tests
pnpm exec playwright test

# Run with UI mode
pnpm exec playwright test --ui

# Run specific test file
pnpm exec playwright test e2e/phone-verification/basic-flow.spec.ts

# Run tests in headed mode (see browser)
pnpm exec playwright test --headed

# Run tests in specific browser
pnpm exec playwright test --project=chromium
pnpm exec playwright test --project=firefox
pnpm exec playwright test --project=webkit
```

### Run Phone Verification Tests Only

```bash
# Run all phone verification tests
pnpm exec playwright test e2e/phone-verification/

# Run with debugging
pnpm exec playwright test e2e/phone-verification/ --debug
```

### Generate Test Report

```bash
# Run tests and generate HTML report
pnpm exec playwright test --reporter=html

# Open report
pnpm exec playwright show-report
```

## Firebase Authentication Setup

For complete E2E testing with actual SMS and Firebase, you have several options:

### Option 1: Firebase Test Phone Numbers (Recommended for CI/CD)

Configure test phone numbers in Firebase Console that don't require actual SMS:

1. Go to Firebase Console → Authentication → Sign-in method → Phone
2. Add test phone numbers with fixed verification codes:
   ```
   +819012345678 → 123456
   +16505551234 → 123456
   +447911123456 → 123456
   ```

3. Update tests to use test numbers:
   ```typescript
   await submitPhoneNumber(page, '9012345678');
   await enterVerificationCode(page, '123456');
   ```

### Option 2: Firebase Auth Emulator (Recommended for Local Development)

Use Firebase emulator suite for local testing:

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize emulators:**
   ```bash
   firebase init emulators
   ```

3. **Start emulator:**
   ```bash
   firebase emulators:start --only auth
   ```

4. **Connect tests to emulator:**
   ```typescript
   import { connectToFirebaseEmulator } from './helpers/firebase-mock';

   test.beforeEach(async ({ page }) => {
     await connectToFirebaseEmulator(page, 'localhost', 9099);
     // ... rest of test
   });
   ```

5. **Update Firebase config to use emulator:**
   ```typescript
   // In your Firebase initialization
   if (process.env.NODE_ENV === 'test') {
     connectAuthEmulator(auth, 'http://localhost:9099');
   }
   ```

### Option 3: Manual Testing

For manual testing or debugging:

1. Use real phone numbers in development
2. Receive actual SMS codes
3. Run tests in headed mode with `--headed` flag
4. Manually enter verification codes when prompted

## GraphQL Mocking

The test suite uses route interception to mock GraphQL responses. This allows testing without a live backend:

```typescript
// Mock successful new user flow
await mockIdentityCheckPhoneUser(page, MOCK_RESPONSES.NEW_USER);

// Mock existing user
await mockIdentityCheckPhoneUser(page, MOCK_RESPONSES.EXISTING_SAME_COMMUNITY);

// Mock errors
await mockGraphQLAuthError(page);
await mockGraphQLNetworkError(page);
```

## Test Structure

### Basic Flow Tests
- ✅ Phone input form display
- ✅ Country selection
- ✅ Phone number formatting
- ✅ Form validation
- ✅ Submit button states
- ✅ Accessibility features

### Complete Flow Tests
- ✅ New user registration flow
- ✅ Existing user login flow
- ✅ Cross-community membership
- ✅ Phone number display in code screen
- ✅ Code resend functionality
- ✅ Back to phone navigation
- ✅ GraphQL error handling

### Integration Tests
- ✅ Firebase + GraphQL integration
- ✅ Multiple user scenarios
- ✅ International number support
- ✅ Loading states
- ✅ Error handling
- ✅ Session persistence
- ✅ Redirect flows

## Debugging Tests

### Debug Mode

Run tests in debug mode to pause execution and inspect:

```bash
# Debug specific test
pnpm exec playwright test e2e/phone-verification/basic-flow.spec.ts --debug

# Debug with Playwright Inspector
PWDEBUG=1 pnpm exec playwright test
```

### Screenshots and Videos

Configure automatic screenshots on failure in `playwright.config.ts`:

```typescript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry',
}
```

### Console Logs

View console logs from the browser:

```typescript
page.on('console', (msg) => console.log('Browser log:', msg.text()));
```

### Network Logs

Log all GraphQL requests:

```typescript
import { logGraphQLRequests } from './helpers/graphql-mock';

test('should do something', async ({ page }) => {
  await logGraphQLRequests(page);
  // ... rest of test
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Run E2E tests
        run: pnpm exec playwright test
        env:
          CI: true

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Best Practices

1. **Use Page Object Model** for complex flows
2. **Mock external services** (Firebase, GraphQL) for reliability
3. **Use test-specific data** to avoid conflicts
4. **Clean up test data** after each test
5. **Run tests in parallel** when possible
6. **Use meaningful assertions** with clear error messages
7. **Test accessibility** with ARIA labels and keyboard navigation
8. **Handle timeouts** appropriately for async operations
9. **Use emulators** for local development
10. **Use test phone numbers** for CI/CD

## Known Limitations

### Current Implementation

1. **Firebase Code Verification**: Tests mock the UI flow but don't actually verify codes without Firebase setup
2. **Rate Limiting**: Not tested in E2E (requires backend setup)
3. **Real SMS**: Not tested (requires Firebase test phone numbers or emulator)
4. **Session Persistence**: Partially tested (requires full auth setup)

### Recommendations for Production

1. Set up Firebase Auth Emulator for local testing
2. Configure Firebase test phone numbers for CI/CD
3. Add integration tests with real backend (staging environment)
4. Test rate limiting with backend API
5. Test SMS delivery with Twilio test credentials
6. Add visual regression testing with Playwright screenshots
7. Add performance testing for form interactions

## Troubleshooting

### Tests Timeout

- Increase timeout in `playwright.config.ts`
- Check if dev server is running
- Verify network connectivity
- Check for console errors

### Firebase Errors

- Verify Firebase configuration
- Check if emulator is running (if using emulator)
- Verify test phone numbers are configured
- Check Firebase quota limits

### GraphQL Errors

- Verify API endpoint is accessible
- Check network mocking setup
- Verify GraphQL schema matches expectations
- Check authentication headers

### Flaky Tests

- Add explicit waits for async operations
- Use `waitForLoadState('networkidle')`
- Avoid hard-coded timeouts
- Use retry mechanism for flaky operations

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Firebase Auth Emulator](https://firebase.google.com/docs/emulator-suite)
- [Firebase Test Phone Numbers](https://firebase.google.com/docs/auth/web/phone-auth#test-with-fictional-phone-numbers)
- [GraphQL Testing Best Practices](https://graphql.org/learn/testing/)

## Contributing

When adding new E2E tests:

1. Follow existing test structure and naming conventions
2. Use test helpers from `helpers/` directory
3. Add clear documentation and comments
4. Test on multiple browsers (Chrome, Firefox, Safari)
5. Ensure tests are reliable and not flaky
6. Update this README with new test coverage
