import type { StorybookConfig } from "@storybook/nextjs"; // Use @storybook/nextjs for Next.js projects
import path from "path"; // Import path for resolving nextConfigPath if needed

const config: StorybookConfig = {
  stories: [ // Paths to stories relative to this config file
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    // If you want to include stories from packages/ui in this Storybook instance:
    // Note: This might complicate builds or alias resolution if not handled carefully.
    // It's often cleaner to run the UI package's Storybook separately.
    // {
    //   directory: "../../packages/ui/src",
    //   titlePrefix: "UI Package",
    //   files: "**/*.stories.@(js|jsx|mjs|ts|tsx)",
    // },
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials", // Includes actions, backgrounds, controls, docs, viewport, toolbars
    "@storybook/addon-interactions", // For play functions and interaction testing
    "@storybook/addon-themes", // For theme switching (e.g., light/dark)
    "msw-storybook-addon", // For mocking API requests with MSW
    // '@storybook/addon-styling-webpack', // If more control over Tailwind/PostCSS is needed than Next.js framework provides
    // '@storybook/addon-coverage', // Optional: for code coverage reports
  ],
  framework: {
    name: "@storybook/nextjs", // Specify Next.js framework
    options: {
      // If your Next.js config is not at the default location or has specific needs:
      // nextConfigPath: path.resolve(__dirname, "../next.config.mjs"),
    },
  },
  docs: {
    autodocs: "tag", // Enable autodocs for all stories with 'tag'
  },
  // Serve static files from Next.js public directory (for MSW worker, images, etc.)
  // The path should be relative to the project root where storybook is run from,
  // or relative to this main.ts file if Storybook's context is set here.
  // For `msw-storybook-addon`, it expects the worker file (e.g., mockServiceWorker.js)
  // to be served from the root.
  staticDirs: ["../public"],
  // webpackFinal: async (config) => {
  //   // Custom Webpack config if needed (less common with Next.js framework which handles much of it)
  //   // For example, to resolve aliases if Storybook doesn't pick them up from tsconfig.json
  //   // if (config.resolve) {
  //   //   config.resolve.alias = {
  //   //     ...config.resolve.alias,
  //   //     "@": path.resolve(__dirname, "../src/"),
  //   //   };
  //   // }
  //   return config;
  // },
};
export default config;
