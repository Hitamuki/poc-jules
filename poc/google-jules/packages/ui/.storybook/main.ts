import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-themes",
    "msw-storybook-addon" // MSW addon
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  // MSW (msw-storybook-addon) requires the Next.js public directory to be served
  // if the worker is located there (as configured in apps/web/package.json).
  // The path should be relative to this .storybook directory.
  // This allows Storybook to find and serve msw's service worker.
  staticDirs: [{ from: "../../apps/web/public", to: "/public" }],
  viteFinal: async (config) => {
    // Customize Vite config here if needed
    return config;
  },
};
export default config;
