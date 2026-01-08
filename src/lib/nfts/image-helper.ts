import { PLACEHOLDER_IMAGE } from "@/utils";

/**
 * NFT画像のURLを取得する
 * izuコミュニティのNFTの場合、instanceIdが0-80の範囲ならローカル画像を使用
 * それ以外は元のimageUrlを使用
 */
export function getNftImageUrl(
  imageUrl: string | null | undefined,
  instanceId: string | null | undefined,
  communityId: string | null | undefined,
): string {
  if (communityId === "izu" && instanceId !== null && instanceId !== undefined) {
    const imageNumber = parseInt(instanceId, 10);
    // 0-80の範囲ならローカル画像を使用 (1.jpg - 81.jpg)
    if (!isNaN(imageNumber) && imageNumber >= 0 && imageNumber <= 80) {
      return `/communities/izu/nfts/${imageNumber + 1}.jpg`;
    }
  }
  // それ以外は元のimageUrlを使用
  return imageUrl ?? PLACEHOLDER_IMAGE;
}
