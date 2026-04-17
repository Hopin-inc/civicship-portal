import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";
import { globalDecorators } from "./decorators";

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/admin/votes",
      },
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },

    viewport: {
      options: {
        mobile: {
          name: "iPhone SE (375px)",
          styles: { width: "375px", height: "667px" },
          type: "mobile",
        },
        mobileLarge: {
          name: "iPhone 14 Pro (390px)",
          styles: { width: "390px", height: "844px" },
          type: "mobile",
        },
        tablet: {
          name: "iPad (768px)",
          styles: { width: "768px", height: "1024px" },
          type: "tablet",
        },
        desktop: {
          name: "Desktop (1280px)",
          styles: { width: "1280px", height: "800px" },
          type: "desktop",
        },
      },
    },
  },
  initialGlobals: {
    viewport: { value: "mobile", isRotated: false },
  },
  decorators: globalDecorators,
};

export default preview;
