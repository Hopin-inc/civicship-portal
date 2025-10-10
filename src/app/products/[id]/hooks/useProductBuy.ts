"use client";

import { useRouter } from "next/navigation";
import { useBuyProductMutation } from "@/types/graphql";
import { toast } from "sonner";

export const useProductBuy = (id: string) => {
  const router = useRouter();
  const [buyProduct, { loading }] = useBuyProductMutation();

  const handleBuy = async () => {
    try {
      const { data } = await buyProduct({ variables: { productId: id } });
      const link = data?.productBuy?.paymentLink;
      if (!link) {
        toast.error("支払いリンクの生成に失敗しました。");
        return;
      }
      toast.success("購入ページに移動します。");
      router.push(link);
    } catch {
      toast.error("購入処理に失敗しました。");
    }
  };

  return {
    handleBuy,
    buying: loading,
  };
};
