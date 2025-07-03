import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

// Base URL to use in actions like `await page.goto('/')`.
// Fallback to localhost:3000 if not set.
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e', // Directory where E2E tests are located, relative to this config file.
  /* Maximum time one test can run for. */
  timeout: 30 * 1000, // 30 seconds
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000, // 5 seconds
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI, or limit workers based on resources. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [['blob'], ['github'], ['list', { printSteps: true }]] // blob for Azure, github for GitHub Actions
    : [['html', { open: 'never', outputFolder: 'playwright-report' }], ['list']], // Local: HTML report and list
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry', // 'on', 'off', 'retain-on-failure'

    /* Record video of tests. */
    // video: 'on-first-retry',

    /* Emulate specific device properties. */
    // viewport: { width: 1280, height: 720 }, // Default desktop viewport

    /* Other useful options */
    // actionTimeout: 0, // Maximum time an action such as `click()` can take. Defaults to 0 (no limit).
    // navigationTimeout: 30000, // Maximum time for navigation actions like `page.goto()`.
    // headless: !!process.env.CI, // Run in headless mode on CI, headed locally for debugging (Playwright default behavior)
    // ignoreHTTPSErrors: true, // If testing against a dev server with self-signed certs
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 7'] }, // Updated to a more recent device
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 14 Pro'] }, // Updated to a more recent device
    },

    /* Example of a project with specific test file pattern */
    // {
    //   name: 'smoke-tests',
    //   testMatch: /.*\.smoke\.spec\.ts/, // Only run files matching this pattern
    //   use: { ...devices['Desktop Chrome'] },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'playwright-results/', // Renamed for clarity

  /* Optional: Run your local dev server before starting the tests.
     Ensure the server is ready before tests begin.
     This is useful for local development and some CI setups.
     For CI pipelines that build and serve the app separately, this might not be needed.
  */
  webServer: !process.env.CI_SKIP_WEBSERVER ? // Allow skipping webserver via env var for specific CI scenarios
  {
    command: 'pnpm dev', // Command to start the Next.js dev server
    url: baseURL,        // URL to poll to ensure server is up and running
    reuseExistingServer: !process.env.CI, // In local dev, reuse if already running; in CI, always start fresh
    timeout: 120 * 1000, // Maximum time (ms) for the server to start. Default is 60s.
    // stdout: 'pipe', // Capture stdout
    // stderr: 'pipe', // Capture stderr
    env: { // Environment variables to pass to the dev server process
      // BROWSER: 'none', // Prevent Next.js from opening browser on start
      // NODE_ENV: 'development', // Or a specific test environment if your app behaves differently
    },
    // cwd: path.resolve(__dirname), // Set working directory if needed (defaults to config file location)
  } : undefined,
});
