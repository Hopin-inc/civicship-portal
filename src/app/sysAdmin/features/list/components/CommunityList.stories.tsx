import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GetCommunitiesDocument } from "@/types/graphql";
import { withApollo } from "../../../../../../.storybook/decorators";
import { CommunityList } from "./CommunityList";

const meta: Meta<typeof CommunityList> = {
  title: "SysAdmin/List/CommunityList",
  component: CommunityList,
  parameters: { layout: "padded" },
  decorators: [
    withApollo,
    (Story) => (
      <div className="max-w-2xl mx-auto p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CommunityList>;

const makeEdges = (items: Array<{ id: string; name: string }>) =>
  items.map((node) => ({
    __typename: "CommunityEdge" as const,
    node: { __typename: "Community" as const, ...node },
  }));

export const WithItems: Story = {
  parameters: {
    apollo: {
      mocks: [
        {
          request: { query: GetCommunitiesDocument },
          result: {
            data: {
              communities: {
                __typename: "CommunitiesConnection",
                totalCount: 3,
                edges: makeEdges([
                  { id: "neo88", name: "NEO四国88祭" },
                  { id: "kibotcha", name: "KIBOTCHA" },
                  { id: "miraikodomojuku", name: "未来こども塾" },
                ]),
              },
            },
          },
        },
      ],
    },
  },
};

export const Empty: Story = {
  parameters: {
    apollo: {
      mocks: [
        {
          request: { query: GetCommunitiesDocument },
          result: {
            data: {
              communities: {
                __typename: "CommunitiesConnection",
                totalCount: 0,
                edges: [],
              },
            },
          },
        },
      ],
    },
  },
};

export const Loading: Story = {
  parameters: {
    apollo: {
      mocks: [
        {
          request: { query: GetCommunitiesDocument },
          delay: Infinity,
          result: {
            data: {
              communities: {
                __typename: "CommunitiesConnection",
                totalCount: 0,
                edges: [],
              },
            },
          },
        },
      ],
    },
  },
};

export const ErrorCase: Story = {
  parameters: {
    apollo: {
      mocks: [
        {
          request: { query: GetCommunitiesDocument },
          error: new Error("GraphQL error"),
        },
      ],
    },
  },
};
