import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

// Attempt to load the UI package's Tailwind config.
// This setup assumes that `@bookmark-todo-app/ui/tailwind.config`
// is accessible and can be required/imported.
let uiPackagePreset: Config | undefined;
try {
  // If packages/ui/tailwind.config.js is CJS (module.exports)
  uiPackagePreset = require("@bookmark-todo-app/ui/tailwind.config.js");
  // If it's ESM and this file is also ESM (.mjs or .ts in an ESM project), you might use:
  // import uiPackageTailwindConfig from "@bookmark-todo-app/ui/tailwind.config.js";
  // uiPackagePreset = uiPackageTailwindConfig;
  if (uiPackagePreset) {
    console.log("Successfully loaded UI package Tailwind preset.");
  }
} catch (error) {
  console.warn(
    "Could not load @bookmark-todo-app/ui/tailwind.config.js. Ensure it is correctly exported and accessible. Falling back to minimal preset.",
    error
  );
  // Provide a minimal fallback or handle the absence of the preset.
  // If the preset is crucial, you might want to throw an error or have a more robust fallback.
  uiPackagePreset = { content: ["../../packages/ui/src/**/*.{ts,tsx,js,jsx}"] } as Config;
}


const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Ensure this path correctly points to your UI package from the perspective of this config file.
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  // Apply the UI package's config as a preset if loaded.
  // The preset will contribute its own content paths, theme extensions, and plugins.
  // Your app-level config here can then override or extend the preset.
  presets: uiPackagePreset ? [uiPackagePreset] : [],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Keyframes and animations from shadcn/ui are typically handled by 'tailwindcss-animate'.
      // If the preset includes it, no need to repeat here. If not, add it to plugins.
      // keyframes: {
      //   "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
      //   "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      // },
      // animation: {
      //   "accordion-down": "accordion-down 0.2s ease-out",
      //   "accordion-up": "accordion-up 0.2s ease-out",
      // },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // Ensure this is listed if not in preset
    require("@tailwindcss/typography"),
    // Any other app-specific plugins
  ],
};

export default config;
