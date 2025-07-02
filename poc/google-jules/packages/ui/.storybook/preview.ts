import type { Preview } from "@storybook/react";
import "../src/styles/globals.css"; // Import Tailwind's base styles and any global CSS
import { initialize, mswLoader } from 'msw-storybook-addon';

// Initialize MSW
initialize({
  // If your API requests are going to a different URL, specify it here.
  // onUnhandledRequest: "bypass", // or "warn" or a custom function
});


const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // backgrounds: {
    //   default: 'light',
    //   values: [
    //     { name: 'light', value: '#ffffff' },
    //     { name: 'dark', value: '#000000' },
    //   ],
    // },
    // For msw addon
    // msw: {
    //   handlers: [] // initial handlers (can be overridden by stories)
    // }
  },
  // Provide the MSW loader globally to all stories
  loaders: [mswLoader],
  // Global decorators can be added here
  // decorators: [
  //   (Story) => (
  //     <ThemeProvider> // Example ThemeProvider
  //       <Story />
  //     </ThemeProvider>
  //   ),
  // ],
};

export default preview;
