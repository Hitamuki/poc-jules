import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path'; // For alias resolution if needed

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', // Using JSDOM for browser-like environment for React components
    setupFiles: ['./vitest.setup.ts'], // Path to the setup file
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json-summary', 'json', 'html', 'lcov'], // Added json-summary
      reportsDirectory: './coverage',
      // Example: include/exclude patterns for coverage
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.stories.{ts,tsx}',
        'src/**/index.ts', // Often exclude barrel files
        'src/lib/utils.ts', // If cn function is considered too simple or covered elsewhere
        'src/styles/**/*', // Exclude style definitions
        // Add other patterns to exclude from coverage if necessary
      ],
      // SonarQube reporter specific configuration (if 'vitest-sonar-reporter' is used in reporters array)
      // This configuration is often passed via CLI or within the 'reporters' array setup.
      // The 'vitest-sonar-reporter' typically picks up its config from vitest's root config.
    },
    reporters: process.env.CI
      ? ['default', 'vitest-sonar-reporter'] // In CI, use default and Sonar reporter
      : ['default', 'html'], // Locally, use default and HTML report for easy viewing
    outputFile: { // For vitest-sonar-reporter
      'vitest-sonar-reporter': 'sonar-report.xml'
    },
    alias: { // If you use path aliases in your components that Vitest needs to resolve
      '@': path.resolve(__dirname, './src'),
    },
  },
});
