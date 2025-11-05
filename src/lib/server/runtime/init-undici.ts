let initialized = false;

function resolveHealthUrlFromApiEndpoint(endpoint: string): string | null {
  try {
    const url = new URL(endpoint);
    const endsWithGraphql = /\/graphql\/?$/.test(url.pathname);
    
    if (endsWithGraphql) {
      url.pathname = url.pathname.replace(/\/graphql\/?$/, '/health');
    } else {
      console.warn('[undici] API endpoint does not end with /graphql, using root /health');
      return new URL('/health', `${url.protocol}//${url.host}`).toString();
    }
    
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch (error) {
    console.error('[undici] Failed to parse API endpoint URL:', (error as Error).message);
    return null;
  }
}

export async function initUndiciAgent() {
  if (process.env.NEXT_RUNTIME === 'edge') {
    return;
  }
  
  if (initialized) {
    return;
  }
  
  try {
    const { Agent, setGlobalDispatcher } = await import('undici');
    
    const agent = new Agent({
      connections: 10,
      pipelining: 1,
      keepAliveTimeout: 60_000,
      keepAliveMaxTimeout: 600_000,
    });
    
    setGlobalDispatcher(agent);
    initialized = true;
    
    console.log('[undici] Global HTTP agent initialized with keep-alive');
    
    const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const healthUrl = apiEndpoint ? resolveHealthUrlFromApiEndpoint(apiEndpoint) : null;
    
    if (healthUrl) {
      fetch(healthUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      })
        .then(() => {
          console.log('[undici] Connection prewarmed to API', { healthUrl });
        })
        .catch((error) => {
          console.warn('[undici] Prewarm failed (non-critical):', (error as Error).message, { healthUrl });
        });
    }
  } catch (error) {
    console.error('[undici] Failed to initialize global agent:', error);
  }
}
