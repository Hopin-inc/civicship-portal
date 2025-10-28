import { Page, Route } from '@playwright/test';

/**
 * GraphQL Mock Helpers for E2E Testing
 *
 * These helpers allow E2E tests to mock GraphQL API responses
 * for consistent and reliable testing.
 */

export type PhoneUserStatus = 'NEW_USER' | 'EXISTING_SAME_COMMUNITY' | 'EXISTING_DIFFERENT_COMMUNITY';

export interface MockUser {
  id: string;
  name: string;
  image?: string;
  bio?: string;
}

export interface MockMembership {
  role: 'ADMIN' | 'MEMBER' | 'GUEST';
}

export interface IdentityCheckPhoneUserResponse {
  status: PhoneUserStatus;
  user?: MockUser | null;
  membership?: MockMembership | null;
}

/**
 * Creates a mock GraphQL response for identityCheckPhoneUser mutation
 */
export function createIdentityCheckResponse(
  status: PhoneUserStatus,
  user?: MockUser | null,
  membership?: MockMembership | null,
): IdentityCheckPhoneUserResponse {
  return {
    status,
    user: user ?? null,
    membership: membership ?? null,
  };
}

/**
 * Mock responses for different user scenarios
 */
export const MOCK_RESPONSES = {
  /**
   * New user who hasn't registered before
   */
  NEW_USER: createIdentityCheckResponse('NEW_USER', null, null),

  /**
   * Existing user in the same community (login scenario)
   */
  EXISTING_SAME_COMMUNITY: createIdentityCheckResponse(
    'EXISTING_SAME_COMMUNITY',
    {
      id: 'user-existing-same-123',
      name: 'Existing User',
      image: 'https://example.com/avatar.jpg',
    },
    {
      role: 'MEMBER',
    },
  ),

  /**
   * Existing user from a different community (cross-community scenario)
   */
  EXISTING_DIFFERENT_COMMUNITY: createIdentityCheckResponse(
    'EXISTING_DIFFERENT_COMMUNITY',
    {
      id: 'user-cross-community-456',
      name: 'Cross Community User',
    },
    {
      role: 'MEMBER',
    },
  ),

  /**
   * Admin user in existing community
   */
  EXISTING_ADMIN: createIdentityCheckResponse(
    'EXISTING_SAME_COMMUNITY',
    {
      id: 'user-admin-789',
      name: 'Admin User',
    },
    {
      role: 'ADMIN',
    },
  ),
} as const;

/**
 * Sets up GraphQL endpoint mocking with custom response
 *
 * @param page - Playwright page instance
 * @param response - Mock response for identityCheckPhoneUser
 */
export async function mockIdentityCheckPhoneUser(
  page: Page,
  response: IdentityCheckPhoneUserResponse,
) {
  await page.route('**/graphql', async (route: Route) => {
    const request = route.request();
    const postData = request.postDataJSON();

    if (postData?.operationName === 'identityCheckPhoneUser') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            identityCheckPhoneUser: response,
          },
        }),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Mocks GraphQL authentication error
 *
 * @param page - Playwright page instance
 * @param errorMessage - Error message to return
 * @param operationName - Optional operation name to target specific GraphQL operations.
 *                        If not provided, all GraphQL requests will return the error.
 */
export async function mockGraphQLAuthError(
  page: Page,
  errorMessage: string = 'Authentication required',
  operationName?: string,
) {
  await page.route('**/graphql', async (route: Route) => {
    const request = route.request();
    const postData = request.postDataJSON();

    // If operationName is specified, only mock that specific operation
    if (operationName && postData?.operationName !== operationName) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        errors: [
          {
            message: errorMessage,
            extensions: {
              code: 'UNAUTHENTICATED',
            },
          },
        ],
      }),
    });
  });
}

/**
 * Mocks GraphQL network error
 *
 * @param page - Playwright page instance
 * @param operationName - Optional operation name to target specific GraphQL operations.
 *                        If not provided, all GraphQL requests will fail.
 */
export async function mockGraphQLNetworkError(page: Page, operationName?: string) {
  await page.route('**/graphql', async (route: Route) => {
    const request = route.request();
    const postData = request.postDataJSON();

    // If operationName is specified, only mock that specific operation
    if (operationName && postData?.operationName !== operationName) {
      await route.continue();
      return;
    }

    await route.abort('failed');
  });
}

/**
 * Mocks GraphQL with delay (for testing loading states)
 *
 * @param page - Playwright page instance
 * @param response - Mock response
 * @param delayMs - Delay in milliseconds
 */
export async function mockIdentityCheckWithDelay(
  page: Page,
  response: IdentityCheckPhoneUserResponse,
  delayMs: number = 2000,
) {
  await page.route('**/graphql', async (route: Route) => {
    const request = route.request();
    const postData = request.postDataJSON();

    if (postData?.operationName === 'identityCheckPhoneUser') {
      // Add delay
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            identityCheckPhoneUser: response,
          },
        }),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Mocks invalid GraphQL response (missing required fields)
 *
 * @param page - Playwright page instance
 */
export async function mockInvalidGraphQLResponse(page: Page) {
  await page.route('**/graphql', async (route: Route) => {
    const request = route.request();
    const postData = request.postDataJSON();

    if (postData?.operationName === 'identityCheckPhoneUser') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            identityCheckPhoneUser: {
              // Missing required 'status' field
              user: null,
              membership: null,
            },
          },
        }),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Sets up comprehensive GraphQL mocking with multiple operation support
 *
 * This allows mocking multiple GraphQL operations at once.
 *
 * @param page - Playwright page instance
 * @param mocks - Map of operation names to response data
 */
export async function setupGraphQLMocks(
  page: Page,
  mocks: Record<string, any>,
) {
  await page.route('**/graphql', async (route: Route) => {
    const request = route.request();
    const postData = request.postDataJSON();

    const operationName = postData?.operationName;

    if (operationName && mocks[operationName]) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            [operationName]: mocks[operationName],
          },
        }),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Creates a GraphQL request logger for debugging
 *
 * Logs all GraphQL requests to console for debugging purposes.
 *
 * @param page - Playwright page instance
 */
export async function logGraphQLRequests(page: Page) {
  await page.route('**/graphql', async (route: Route) => {
    const request = route.request();
    const postData = request.postDataJSON();

    console.log('[GraphQL Request]', {
      operationName: postData?.operationName,
      variables: postData?.variables,
    });

    await route.continue();
  });
}

/**
 * Waits for a specific GraphQL operation to complete
 *
 * @param page - Playwright page instance
 * @param operationName - GraphQL operation name to wait for
 * @param timeout - Maximum wait time in ms
 */
export async function waitForGraphQLOperation(
  page: Page,
  operationName: string,
  timeout: number = 10000,
): Promise<void> {
  await page.waitForResponse(
    (response) => {
      if (!response.url().includes('graphql')) {
        return false;
      }
      try {
        const postData = response.request().postDataJSON();
        return postData?.operationName === operationName;
      } catch (e) {
        // Ignore JSON parse errors
        return false;
      }
    },
    { timeout },
  );
}

/**
 * Example usage in tests:
 *
 * ```typescript
 * import { mockIdentityCheckPhoneUser, MOCK_RESPONSES } from './helpers/graphql-mock';
 *
 * test('should handle new user', async ({ page }) => {
 *   await mockIdentityCheckPhoneUser(page, MOCK_RESPONSES.NEW_USER);
 *   // ... rest of test
 * });
 * ```
 */
