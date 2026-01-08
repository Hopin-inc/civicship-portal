import { PLACEHOLDER_IMAGE } from "@/utils";

const IZU_COMMUNITY_ID = "izu";
const IZU_NFT_ID_RANGE_START = 0;
const IZU_NFT_ID_RANGE_END = 80;

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
  if (communityId === IZU_COMMUNITY_ID && instanceId) {
    const imageNumber = parseInt(instanceId, 10);
    // 0-80の範囲ならローカル画像を使用 (1.jpg - 81.jpg)
    if (!isNaN(imageNumber) && imageNumber >= IZU_NFT_ID_RANGE_START && imageNumber <= IZU_NFT_ID_RANGE_END) {
      return `/communities/${IZU_COMMUNITY_ID}/nfts/${imageNumber + 1}.jpg`;
    }
  }
  // それ以外は元のimageUrlを使用
  return imageUrl ?? PLACEHOLDER_IMAGE;
}
