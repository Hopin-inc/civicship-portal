let initialized = false;

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
      connections: 10,           // 同時接続数
      pipelining: 1,             // パイプライン化
      keepAliveTimeout: 60_000,  // 60秒
      keepAliveMaxTimeout: 600_000, // 10分
    });
    
    setGlobalDispatcher(agent);
    initialized = true;
    
    console.log('[undici] Global HTTP agent initialized with keep-alive');
    
    const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
    if (apiEndpoint) {
      try {
        await fetch(`${apiEndpoint}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000), // 5秒タイムアウト
        });
        console.log('[undici] Connection prewarmed to API');
      } catch (error) {
        console.warn('[undici] Prewarm failed (non-critical):', (error as Error).message);
      }
    }
  } catch (error) {
    console.error('[undici] Failed to initialize global agent:', error);
  }
}
