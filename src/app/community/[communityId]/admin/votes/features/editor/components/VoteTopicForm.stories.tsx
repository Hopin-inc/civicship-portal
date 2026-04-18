import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { GqlRole, GqlVoteGateType, GqlVotePowerPolicyType } from "@/types/graphql";
import { VoteTopicForm } from "./VoteTopicForm";
import { VoteEditorLayout } from "./VoteEditorLayout";
import { withVoteForm } from "../__stories__/withForm";
import { mockNftTokens } from "../__stories__/fixtures";

const meta: Meta<typeof VoteTopicForm> = {
  title: "AdminVotes/VoteTopicForm",
  component: VoteTopicForm,
  parameters: { layout: "fullscreen" },
  args: {
    onSubmit: fn((e) => e.preventDefault()),
    saving: false,
    nftTokens: mockNftTokens,
    nftTokensLoading: false,
  },
  decorators: [
    (Story) => (
      <VoteEditorLayout>
        <Story />
      </VoteEditorLayout>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VoteTopicForm>;

/** 初期表示: 全セクションが空、gate=MEMBERSHIP / power=FLAT */
export const Default: Story = {
  decorators: [withVoteForm()],
};

/** すべて記入済み: NFT 投票 */
export const Filled: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        title: "次の地域イベントは何にする？",
        description: "5月の連休に開催する地域イベントの内容を投票で決めます。",
        options: [
          { label: "地域の夏祭り" },
          { label: "ハイキングイベント" },
          { label: "フリーマーケット" },
        ],
        gate: {
          type: GqlVoteGateType.Nft,
          requiredRole: null,
          nftTokenId: mockNftTokens[0].id,
        },
        powerPolicy: {
          type: GqlVotePowerPolicyType.NftCount,
          nftTokenId: mockNftTokens[0].id,
        },
      },
    }),
  ],
};

/** メンバーシップ + OWNER 投票 */
export const MembershipOwnerOnly: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        title: "コミュニティ方針の重要な決定",
        description: "オーナー権限のメンバーのみ投票可能です。",
        options: [{ label: "賛成" }, { label: "反対" }],
        gate: {
          type: GqlVoteGateType.Membership,
          requiredRole: GqlRole.Owner,
          nftTokenId: null,
        },
      },
    }),
  ],
};

/** 送信中 */
export const Saving: Story = {
  args: { saving: true },
  decorators: [
    withVoteForm({
      defaultValues: {
        title: "送信中の投票",
        options: [{ label: "A" }, { label: "B" }],
      },
    }),
  ],
};

/** 送信後のバリデーションエラー状態 */
export const WithValidationErrors: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        title: "",
        options: [{ label: "" }, { label: "" }],
        gate: {
          type: GqlVoteGateType.Nft,
          requiredRole: null,
          nftTokenId: "",
        },
      },
      errors: [
        { path: "title", message: "タイトルを入力してください" },
        { path: "options.0.label", message: "選択肢のラベルを入力してください" },
        { path: "options.1.label", message: "選択肢のラベルを入力してください" },
        { path: "gate.nftTokenId", message: "NFT を選択してください" },
      ],
    }),
  ],
};

/** 編集モード: 全フィールドに初期値がロードされた状態 */
export const UpdateMode: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        title: "既存の投票テーマ",
        description: "この投票は編集中です。",
        options: [
          { label: "地域の夏祭り" },
          { label: "ハイキングイベント" },
          { label: "フリーマーケット" },
        ],
        gate: {
          type: GqlVoteGateType.Membership,
          requiredRole: GqlRole.Member,
          nftTokenId: null,
        },
        powerPolicy: {
          type: GqlVotePowerPolicyType.Flat,
          nftTokenId: null,
        },
      },
    }),
  ],
};

/** 編集モード (NFT): NFT gate + NFT_COUNT の初期値 */
export const UpdateModeNft: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        title: "NFT 保有者限定の投票",
        description: "コミュニティパス保有者のみ参加可能。",
        options: [{ label: "賛成" }, { label: "反対" }],
        gate: {
          type: GqlVoteGateType.Nft,
          requiredRole: null,
          nftTokenId: mockNftTokens[0].id,
        },
        powerPolicy: {
          type: GqlVotePowerPolicyType.NftCount,
          nftTokenId: mockNftTokens[0].id,
        },
      },
    }),
  ],
};
