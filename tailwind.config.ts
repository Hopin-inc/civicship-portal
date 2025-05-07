import type { Config } from "tailwindcss";
import type plugin from "tailwindcss/plugin";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "hsl(var(--background))",
          hover: "hsl(var(--background-hover))",
        },
        foreground: "hsl(var(--foreground))",
        caption: "hsl(var(--caption))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          hover: "hsl(var(--secondary-hover))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
          hover: "hsl(var(--tertiary-hover))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          hover: "hsl(var(--destructive-hover))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          hover: "hsl(var(--warning-hover))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          hover: "hsl(var(--success-hover))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
          hover: "hsl(var(--muted-hover))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          hover: "hsl(var(--accent-hover))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontSize: {
        "display-xl": [
          "var(--font-size-huge)",
          { lineHeight: "var(--line-height-sm)", fontWeight: "700" },
        ],
        "display-lg": [
          "var(--font-size-xxl)",
          { lineHeight: "var(--line-height-sm)", fontWeight: "700" },
        ],
        "display-md": [
          "var(--font-size-xl)",
          { lineHeight: "var(--line-height-sm)", fontWeight: "700" },
        ],
        "display-sm": [
          "var(--font-size-lg)",
          { lineHeight: "var(--line-height-sm)", fontWeight: "700" },
        ],
        "title-lg": [
          "var(--font-size-xl)",
          { lineHeight: "var(--line-height-sm)", fontWeight: "700" },
        ],
        "title-md": [
          "var(--font-size-lg)",
          { lineHeight: "var(--line-height-sm)", fontWeight: "700" },
        ],
        "title-sm": [
          "var(--font-size-md)",
          { lineHeight: "var(--line-height-sm)", fontWeight: "700" },
        ],
        "body-lg": [
          "var(--font-size-lg)",
          { lineHeight: "var(--line-height-md)", fontWeight: "400" },
        ],
        "body-md": [
          "var(--font-size-mg)",
          { lineHeight: "var(--line-height-md)", fontWeight: "400" },
        ],
        "body-sm": [
          "var(--font-size-sm)",
          { lineHeight: "var(--line-height-md)", fontWeight: "400" },
        ],
        "body-xs": [
          "var(--font-size-xs)",
          { lineHeight: "var(--line-height-md)", fontWeight: "400" },
        ],
        "label-lg": [
          "var(--font-size-lg)",
          { lineHeight: "var(--line-height-xs)", fontWeight: "500" },
        ],
        "label-md": [
          "var(--font-size-mg)",
          { lineHeight: "var(--line-height-xs)", fontWeight: "500" },
        ],
        "label-sm": [
          "var(--font-size-sm)",
          { lineHeight: "var(--line-height-xs)", fontWeight: "500" },
        ],
        "label-xs": [
          "var(--font-size-xs)",
          { lineHeight: "var(--line-height-xs)", fontWeight: "500" },
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "hsl(var(--foreground))",
            h1: {
              fontSize: "var(--font-size-huge)",
              color: "hsl(var(--foreground))",
              fontWeight: "700",
            },
            h2: {
              fontSize: "var(--font-size-xxl)",
              color: "hsl(var(--foreground))",
              fontWeight: "700",
            },
            h3: {
              fontSize: "var(--font-size-xl)",
              color: "hsl(var(--foreground))",
              fontWeight: "700",
            },
            h4: {
              fontSize: "var(--font-size-lg)",
              color: "hsl(var(--foreground))",
              fontWeight: "600",
            },
            "h5,h6": {
              fontSize: "var(--font-size-md)",
              color: "hsl(var(--foreground))",
            },
            a: {
              fontSize: "var(--font-size-md)",
              color: "hsl(var(--primary))",
              "&:hover": {
                color: "hsl(var(--primary-hover))",
              },
            },
            p: {
              fontSize: "var(--font-size-md)",
              color: "hsl(var(--foreground))",
            },
            li: {
              fontSize: "var(--font-size-md)",
              color: "hsl(var(--foreground))",
            },
            img: {
              borderRadius: "0.5rem",
            },
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      maxWidth: {
        'mobile-l': '425px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    function ({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",
          /* Firefox */
          "scrollbar-width": "none",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
} satisfies Config;

export default config;
