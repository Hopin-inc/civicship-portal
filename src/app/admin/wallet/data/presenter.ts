import { GqlTransaction, GqlWalletType } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";

export const getToWalletImage = (node: GqlTransaction): string => {
  if (node.toWallet?.type === GqlWalletType.Community) {
    return node.toWallet.community?.image || PLACEHOLDER_IMAGE;
  }
  return node.toWallet?.user?.image || PLACEHOLDER_IMAGE;
};

export const getFromWalletImage = (node: GqlTransaction): string => {
  if (node.fromWallet?.type === GqlWalletType.Community) {
    return node.fromWallet.community?.image || PLACEHOLDER_IMAGE;
  }
  return node.fromWallet?.user?.image || PLACEHOLDER_IMAGE;
}
