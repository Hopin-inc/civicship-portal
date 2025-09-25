import { GqlTransaction } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";

export const getToUserImage = (node: GqlTransaction): string => {
  return node.toWallet?.user?.image || PLACEHOLDER_IMAGE;
}

export const getFromUserImage = (node: GqlTransaction): string => {
  return node.fromWallet?.user?.image || PLACEHOLDER_IMAGE;
}
