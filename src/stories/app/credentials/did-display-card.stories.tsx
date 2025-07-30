import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DidDisplayCard } from "@/app/credentials/[id]/components/DidDisplayCard";

const truncateDid = (did: string | undefined | null, length: number = 20): string => {
  if (!did) return "";
  if (did.length <= length) return did;
  const start = did.substring(0, length);
  const end = did.substring(did.length - 10);
  return `${start}...${end}`;
};

const meta: Meta<typeof DidDisplayCard> = {
  title: "App/Credentials/DidDisplayCard",
  component: DidDisplayCard,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    name: { control: "text" },
    did: { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component: "DID表示カード。ユーザー名とDIDを表示し、DIDのコピー機能を提供。",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DidDisplayCard>;

export const Organizer: Story = {
  args: {
    label: "主催者",
    name: "田中太郎",
    did: "did:example:123456789abcdefghijklmnopqrstuvwxyz",
    truncateDid,
  },
};

export const Participant: Story = {
  args: {
    label: "参加者", 
    name: "佐藤花子",
    did: "did:example:987654321zyxwvutsrqponmlkjihgfedcba",
    truncateDid,
  },
};

export const PendingDid: Story = {
  args: {
    label: "参加者",
    name: "山田次郎", 
    did: null,
    truncateDid,
  },
};

export const LongName: Story = {
  args: {
    label: "主催者",
    name: "とても長い名前のユーザーさん",
    did: "did:example:verylongdidstringwithmanycharacters123456789",
    truncateDid,
  },
};
