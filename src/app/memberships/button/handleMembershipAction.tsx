import { toast } from "sonner";
import { MutationFunction, MutationFunctionOptions } from "@apollo/client";

// TData: ミューテーションの結果の型
// TVariables: ミューテーションに渡される変数の型
export const handleMembershipAction = async <
  TData = any,
  TVariables = Record<string, any>
>(
  action: MutationFunction<TData, TVariables>, // Apollo Client の MutationFunction 型を使用
  variables: TVariables
): Promise<void> => {
  try {
    await action({
      variables,
    } as MutationFunctionOptions<TData, TVariables>); // キャストを追加
    toast.success("操作が完了しました。");
  } catch (error) {
    console.error(error);
    toast.error("操作に失敗しました。");
  }
};
