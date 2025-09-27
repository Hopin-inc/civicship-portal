import { cookies } from 'next/headers';
import { logger } from '@/lib/logging';

export type AuthStep = "NEED_LOGIN" | "NEED_SIGNUP_PHONE" | "NEED_SIGNUP_PROFILE" | "SIGNED_IN";

export async function getAuthStep(): Promise<AuthStep> {
  try {
    const cookieStore = await cookies();
    const lineToken = cookieStore.get('line_auth_token')?.value;
    
    if (!lineToken) {
      logger.debug('No LINE token found', {
        component: 'getAuthStep',
        authStep: 'NEED_LOGIN'
      });
      return "NEED_LOGIN";
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lineToken}`,
          'X-Community-Id': process.env.NEXT_PUBLIC_COMMUNITY_ID || '',
          'X-Civicship-Tenant': process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID || '',
        },
        body: JSON.stringify({
          query: `
            query GetCurrentUser {
              currentUser {
                user {
                  id
                }
              }
            }
          `
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        const user = result?.data?.currentUser?.user;
        
        if (user) {
          logger.debug('User found, signed in', {
            component: 'getAuthStep',
            authStep: 'SIGNED_IN',
            userId: user.id
          });
          return "SIGNED_IN";
        }
      }
    } catch (error) {
      logger.debug('Failed to check user existence', {
        component: 'getAuthStep',
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    const phoneToken = cookieStore.get('phone_auth_token')?.value;
    const phoneUid = cookieStore.get('phone_uid')?.value;
    
    if (phoneToken && phoneUid) {
      logger.debug('Phone token exists, need profile signup', {
        component: 'getAuthStep',
        authStep: 'NEED_SIGNUP_PROFILE'
      });
      return "NEED_SIGNUP_PROFILE";
    }
    
    logger.debug('No phone token, need phone signup', {
      component: 'getAuthStep',
      authStep: 'NEED_SIGNUP_PHONE'
    });
    return "NEED_SIGNUP_PHONE";
  } catch (error) {
    logger.debug('Auth step check failed', {
      component: 'getAuthStep',
      error: error instanceof Error ? error.message : String(error),
      authStep: 'NEED_LOGIN'
    });
    return "NEED_LOGIN";
  }
}
