/**
 * URLから画像をダウンロードしてFileオブジェクトに変換する
 */
export async function urlToFile(url: string, filename: string): Promise<File | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    const file = new File([blob], filename, { type: blob.type });
    return file;
  } catch (error) {
    console.error("Failed to convert URL to File:", error);
    return null;
  }
}
