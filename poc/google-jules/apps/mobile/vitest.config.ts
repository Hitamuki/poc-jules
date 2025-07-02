import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    // For React Native, 'node' environment is typically used.
    // Native components and APIs are mocked in the setup file.
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'], // Path to global setup file
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'app/**/*.{ts,tsx}', // Include files in the app directory (screens, layouts)
        'src/**/*.{ts,tsx}', // Include files in a potential src directory (components, hooks, store, etc.)
        // Adjust include patterns based on your actual project structure
      ],
      exclude: [
        // Files and patterns to exclude from coverage
        'app/**/_layout.tsx', // Often layout files are hard to unit test meaningfully
        'app/index.tsx',      // Root index might just be a redirect
        'app/modal.tsx',      // Example modal, might be simple
        'src/**/*.stories.{ts,tsx}', // Storybook stories if any
        'src/**/index.ts', // Barrel files
        'src/types/**/*', // Type definitions
        'assets/**/*', // Static assets
        'constants/**/*', // Constants might not need coverage
        // Config files
        '*.config.js',
        '*.config.ts',
        'babel.config.js',
        'vitest.setup.ts',
        // Add other patterns to exclude
      ],
      all: true, // Report coverage for all included files, not just tested ones
    },
    reporters: process.env.CI
      ? ['default', 'vitest-sonar-reporter']
      : ['default', 'html'],
    outputFile: {
      'vitest-sonar-reporter': 'sonar-report.xml'
    },
    // Mocks for React Native specific imports might be needed here if not handled globally or by Vitest defaults
    // server: {
    //   deps: {
    //     inline: [ // Dependencies that need to be transformed by Vitest's pipeline
    //       // Example: Force Vitest to process these if they cause issues
    //       // /@react-native/,
    //       // /react-native/,
    //       // /expo/,
    //       // /@expo/,
    //       // /@expo\/vector-icons/,
    //     ],
    //   },
    // },
    // Vitest doesn't use Metro, so transforms for specific RN features might need configuration
    // if you encounter issues with syntax or module resolution not covered by mocks.
  },
});
