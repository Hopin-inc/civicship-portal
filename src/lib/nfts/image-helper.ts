import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { PLACEHOLDER_IMAGE } from "@/utils";

/**
 * NFT画像のURLを取得する
 * izuコミュニティの場合、instanceIdが0-80の範囲ならローカル画像を使用
 * それ以外は元のimageUrlを使用
 */
export function getNftImageUrl(
  imageUrl: string | null | undefined,
  instanceId: string | null | undefined,
): string {
  if (COMMUNITY_ID === "izu" && instanceId !== null && instanceId !== undefined) {
    const imageNumber = parseInt(instanceId, 10);
    // 0-80の範囲ならローカル画像を使用 (1.jpg - 81.jpg)
    if (!isNaN(imageNumber) && imageNumber >= 0 && imageNumber <= 80) {
      return `/communities/izu/nfts/${imageNumber + 1}.jpg`;
    }
  }
  // それ以外は元のimageUrlを使用
  return imageUrl ?? PLACEHOLDER_IMAGE;
}
