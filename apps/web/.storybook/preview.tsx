import React from 'react';
import type { Preview, Decorator } from "@storybook/react";
import { initialize, mswLoader } from 'msw-storybook-addon';
import { ThemeProvider } from "../src/components/providers/theme-provider"; // App's ThemeProvider
import { JotaiProvider } from '../src/components/providers/jotai-provider'; // App's JotaiProvider
// If using tRPC and React Query, you might want to wrap stories with their providers too.
// import { TRPCReactProvider } from '../src/lib/trpc/react'; // Adjust path
// import { ReactQueryProvider } from '../src/components/providers/react-query-provider'; // Adjust path

import '../src/app/globals.css'; // Import global styles to ensure Tailwind is applied

// Initialize MSW.
// `initialize` should be called once.
// The `onUnhandledRequest` option is useful for debugging.
initialize({
  onUnhandledRequest: ({ method, url }) => {
    // Optionally ignore specific paths if they are known to be unhandled (e.g., HMR, analytics)
    if (url.pathname.startsWith("/_next/static") || url.pathname.startsWith("/@vite")) {
      return;
    }
    console.warn(`[MSW] Unhandled request: ${method} ${url.href}`);
  },
  // If your mockServiceWorker.js is not in the default /public location relative to Storybook root,
  // you might need to specify its path here, though `staticDirs` in main.ts should handle serving it.
  // serviceWorker: {
  //   url: '/mockServiceWorker.js' // Default is fine if served from root via staticDirs
  // }
});

const withGlobalProviders: Decorator = (Story, context) => {
  // Access the theme from Storybook's global context, set by the theme switcher addon
  const currentTheme = context.globals.theme || "system";

  // Here you could also add mock tRPC provider if needed for stories
  // const [queryClient] = React.useState(() => new QueryClient());
  // const [trpcClient] = React.useState(() => /* create your trpc client */);

  return (
    // <TRPCReactProvider client={trpcClient} queryClient={queryClient}>
      // <ReactQueryProvider client={queryClient}>
        <JotaiProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme={currentTheme} // Use Storybook's theme switcher value
            enableSystem
            disableTransitionOnChange
            storageKey="storybook-theme" // Use a different storage key for Storybook theme
          >
            {/* Mimic the html and body structure from RootLayout for consistent styling */}
            <div lang="ja" className={`font-sans antialiased`}> {/* Add font-sans from Inter variable if needed globally */}
              <Story />
            </div>
          </ThemeProvider>
        </JotaiProvider>
      // </ReactQueryProvider>
    // </TRPCReactProvider>
  );
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // MSW addon parameters:
    // msw: {
    //   handlers: {
    //     // auth: [http.get('/api/user', () => HttpResponse.json({ id: '123' }))], // Example global handlers
    //     // You can also import handlers from your mocks directory:
    //     // ...sharedHandlers,
    //   }
    // },
    // backgrounds: { // Optional: if you want to control background outside of next-themes
    //   default: 'light',
    //   values: [
    //     { name: 'light', value: '#ffffff' },
    //     { name: 'dark', value: '#000000' }, // Or your dark theme background color
    //   ],
    // },
  },
  // MSW loader must be added globally for all stories
  loaders: [mswLoader],
  decorators: [
    withGlobalProviders,
  ],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'system', // Default to system theme
      toolbar: {
        icon: 'paintbrush', // Updated icon for theme
        items: [
          { value: 'light', title: 'Light', left: '☀️' },
          { value: 'dark', title: 'Dark', left: '🌙' },
          { value: 'system', title: 'System', left: '💻' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
