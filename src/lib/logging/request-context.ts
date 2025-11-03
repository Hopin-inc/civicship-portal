import { headers } from "next/headers";
import { cache } from "react";

/**
 * リクエストごとの correlation ID を取得
 * 
 * Cloud Run の x-cloud-trace-context ヘッダーから trace ID を抽出するか、
 * ローカル環境では UUID を生成します。
 * 
 * cache() を使用してリクエスト内で同じ値を返すようにします。
 */
export const getCorrelationId = cache(async (): Promise<string> => {
  const headersList = await headers();
  const traceContext = headersList.get("x-cloud-trace-context");

  if (traceContext) {
    const traceId = traceContext.split("/")[0];
    return traceId;
  }

  return crypto.randomUUID();
});
