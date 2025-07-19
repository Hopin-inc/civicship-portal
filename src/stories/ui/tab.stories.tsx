import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const meta: Meta<typeof Tabs> = {
  title: "Shared/UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">タブ1</TabsTrigger>
        <TabsTrigger value="tab2">タブ2</TabsTrigger>
        <TabsTrigger value="tab3">タブ3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">タブ1の内容</TabsContent>
      <TabsContent value="tab2">タブ2の内容</TabsContent>
      <TabsContent value="tab3">タブ3の内容</TabsContent>
    </Tabs>
  ),
};
