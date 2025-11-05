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
  } catch (error) {
    console.error('[undici] Failed to initialize global agent:', error);
  }
}
