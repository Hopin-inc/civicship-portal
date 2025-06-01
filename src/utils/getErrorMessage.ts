export const getSimpleErrorMessage = (error: unknown, context?: string): string => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes("network") || message.includes("failed to fetch")) {
      return "通信エラーが発生しました";
    }
    
    if (message.includes("timeout")) {
      return "通信がタイムアウトしました";
    }
    
    if (message.includes("unauthorized") || message.includes("unauthenticated")) {
      return "認証が必要です";
    }
    
    if (message.includes("internal_server_error") || message.includes("internal server error")) {
      return "サーバーエラーが発生しました";
    }
  }
  
  const baseMessage = context 
    ? `${context}に失敗しました` 
    : "処理に失敗しました";
    
  return baseMessage;
};
