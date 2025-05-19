import { GqlCurrentPrefecture, useUserSignUpMutation } from "@/types/graphql";
import { toast } from "sonner";
import { COMMUNITY_ID } from "@/utils";
import { getVerifiedPhoneNumber } from "@/contexts/auth/phone/utils";

// 電話番号を検証し、検証された電話番号を取得する関数
const getPhoneNumberOrThrow = (): string => {
  const phoneNumber = getVerifiedPhoneNumber();
  if (!phoneNumber) {
    throw new Error("No verified phone number found.");
  }
  return phoneNumber;
};

// ユーザー作成のためのデータ送信処理を行う関数
const sendUserSignUpRequest = async (
  userSignUpMutation: any,
  name: string,
  currentPrefecture: GqlCurrentPrefecture,
  phoneNumber: string,
  phoneUid?: string | null,
) => {
  const effectivePhoneUid = phoneUid || undefined;

  const { data } = await userSignUpMutation({
    variables: {
      input: {
        name,
        currentPrefecture: currentPrefecture,
        communityId: COMMUNITY_ID,
        phoneUid: effectivePhoneUid,
        phoneNumber,
      },
    },
  });

  return data?.userSignUp?.user ?? null;
};

// ユーザー作成の処理を行うフック
const useSignUp = () => {
  const [userSignUpMutation] = useUserSignUpMutation();

  const createUser = async (
    name: string,
    currentPrefecture: GqlCurrentPrefecture,
    phoneUid?: string | null,
  ) => {
    try {
      const phoneNumber = getPhoneNumberOrThrow();
      return await sendUserSignUpRequest(
        userSignUpMutation,
        name,
        currentPrefecture,
        phoneNumber,
        phoneUid,
      );
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error("ユーザー作成に失敗しました");
      return null;
    }
  };

  return { createUser };
};

export default useSignUp;
