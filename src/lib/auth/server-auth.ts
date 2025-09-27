import { cookies } from 'next/headers';
import { apolloClient } from '@/lib/apollo';
import { GET_CURRENT_USER } from '@/graphql/account/identity/query';
import { LINK_PHONE_AUTH } from '@/graphql/account/identity/mutation';
import { logger } from '@/lib/logging';

export type AuthStep = "NEED_LOGIN" | "NEED_SIGNUP_PHONE" | "NEED_SIGNUP_PROFILE" | "SIGNED_IN";

export async function getAuthStep(): Promise<AuthStep> {
  try {
    const cookieStore = cookies();
    const lineToken = cookieStore.get('line_auth_token')?.value;
    
    if (!lineToken) {
      logger.debug('No LINE token found', {
        component: 'getAuthStep',
        authStep: 'NEED_LOGIN'
      });
      return "NEED_LOGIN";
    }
    
    const { data } = await apolloClient.query({
      query: GET_CURRENT_USER,
      fetchPolicy: "network-only",
      context: {
        headers: {
          Authorization: `Bearer ${lineToken}`,
          "X-Community-Id": process.env.NEXT_PUBLIC_COMMUNITY_ID || "",
        },
      },
    });
    
    const user = data?.currentUser?.user;
    
    if (user) {
      logger.debug('User found, signed in', {
        component: 'getAuthStep',
        authStep: 'SIGNED_IN',
        userId: user.id
      });
      return "SIGNED_IN";
    }
    
    const phoneToken = cookieStore.get('phone_auth_token')?.value;
    const phoneUid = cookieStore.get('phone_uid')?.value;
    
    if (phoneToken && phoneUid) {
      try {
        const { data: linkData } = await apolloClient.mutate({
          mutation: LINK_PHONE_AUTH,
          variables: {
            input: { phoneUid },
            permission: { userId: phoneUid }
          },
          context: {
            headers: {
              Authorization: `Bearer ${lineToken}`,
              "X-Phone-Auth-Token": phoneToken,
              "X-Community-Id": process.env.NEXT_PUBLIC_COMMUNITY_ID || "",
            },
          },
        });
        
        if (linkData?.linkPhoneAuth?.success) {
          logger.debug('Silent LINE identity linking successful', {
            component: 'getAuthStep',
            authStep: 'SIGNED_IN',
            phoneUid
          });
          return "SIGNED_IN";
        }
      } catch (error) {
        logger.debug('Silent LINE identity linking failed', {
          component: 'getAuthStep',
          error: error instanceof Error ? error.message : String(error),
          phoneUid
        });
      }
      
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
