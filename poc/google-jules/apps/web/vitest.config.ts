import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', // Use JSDOM for React components and browser APIs
    setupFiles: ['./vitest.setup.ts'], // Path to global setup file
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json-summary', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage/vitest', // Store Vitest coverage reports separately
      include: ['src/**/*.{ts,tsx}'], // Files to include in coverage
      exclude: [ // Files/patterns to exclude from coverage
        'src/**/*.stories.{ts,tsx}',
        'src/**/index.ts', // Barrel files
        'src/app/**/(layout|page|template|not-found|error|loading).tsx', // Next.js specific files
        'src/components/providers/**/*', // Provider components
        'src/lib/trpc/**/*', // tRPC client/server setup (test tRPC procedures separately if needed)
        'src/mocks/**/*', // MSW mock definitions
        'src/types/**/*', // Type definitions
        'src/generated/**/*', // Auto-generated files
        '.storybook/**/*', // Storybook configuration files
        'next-env.d.ts', // Next.js environment types
        'postcss.config.mjs',
        'tailwind.config.ts',
        'next.config.mjs',
        'vitest.config.ts',
        'vitest.setup.ts',
        'playwright.config.ts',
        // Add any other files/patterns to exclude
      ],
      all: true, // Report coverage for all files included, not just tested ones
    },
    reporters: process.env.CI
      ? ['default', 'vitest-sonar-reporter'] // CI environment reporters
      : ['default', 'html'], // Local development reporters (HTML report is useful)
    outputFile: { // Configuration for vitest-sonar-reporter
      'vitest-sonar-reporter': 'sonar-report.xml' // Output file for SonarQube
    },
    alias: {
      '@': path.resolve(__dirname, './src'),
      // If you have other path aliases (e.g., from tsconfig.json) that Vitest should know:
      // Example: '@ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
    // Optional: Configure options for specific test files or patterns
    // includeSource: ['src/**/*.{js,jsx,ts,tsx}'], // To include source maps for better stack traces
  },
});
