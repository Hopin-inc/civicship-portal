import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import PlaceToggleButton from "@/app/places/components/ToggleButton";

const meta: Meta<typeof PlaceToggleButton> = {
  title: "App/Places/PlaceToggleButton",
  component: PlaceToggleButton,
  tags: ["autodocs"],
  argTypes: {
    isMapMode: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: {
        component: "地図・一覧切り替えボタン。現在のモードに応じてアイコンとテキストが変わる。",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlaceToggleButton>;

export const MapMode: Story = {
  args: {
    isMapMode: true,
    onClick: () => console.log("Switch to list mode"),
  },
};

export const ListMode: Story = {
  args: {
    isMapMode: false,
    onClick: () => console.log("Switch to map mode"),
  },
};

// Temporarily commented out due to React Hooks in render function ESLint error
// export const Interactive: Story = {
//   render: () => {
//     const [isMapMode, setIsMapMode] = React.useState(false);
//     return (
//       <PlaceToggleButton 
//         isMapMode={isMapMode}
//         onClick={() => setIsMapMode(!isMapMode)}
//       />
//     );
//   },
// };
