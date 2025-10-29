/**
 * URLから画像をダウンロードしてFileオブジェクトに変換する
 * タイムアウト: 5秒
 */
export async function urlToFile(url: string, filename: string): Promise<File | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒でタイムアウト

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      mode: 'cors',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    const file = new File([blob], filename, { type: blob.type });
    return file;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      console.warn("Image download timeout:", url);
    } else {
      console.warn("Failed to convert URL to File:", error);
    }
    return null;
  }
}
