import '@testing-library/jest-dom/vitest'; // Extends Vitest's expect with jest-dom matchers
import { vi } from 'vitest';
import { server } from './src/mocks/server'; // Import MSW server instance

// --- Global Test Setup ---

// Establish API mocking before all tests.
// 'onUnhandledRequest: 'warn'' will log a warning for unhandled requests,
// which is useful during development. For CI, 'error' might be preferred.
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset any request handlers that may have been added during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after all tests are finished.
afterAll(() => server.close());

// --- Global Mocks ---

// Mock `window.matchMedia`
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock `window.IntersectionObserver`
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(() => []), // Ensure takeRecords returns an array
});
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: mockIntersectionObserver,
});

// Mock `window.ResizeObserver`
const mockResizeObserver = vi.fn();
mockResizeObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: mockResizeObserver,
});


// Mock Next.js Navigation (App Router)
// This provides basic mocks for common navigation hooks.
// Extend as needed for other hooks or more complex scenarios.
vi.mock('next/navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/navigation')>();
  return {
    ...actual, // Spread actual module to keep other exports intact
    useRouter: () => ({
      push: vi.fn((href: string) => Promise.resolve(true)), // Mock push to return a Promise
      replace: vi.fn((href: string) => Promise.resolve(true)), // Mock replace
      refresh: vi.fn(() => Promise.resolve(true)), // Mock refresh
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn((href: string) => Promise.resolve()), // Mock prefetch
      // Add other router methods if your components use them
    }),
    usePathname: () => '/', // Default mock pathname
    useSearchParams: () => new URLSearchParams(), // Default mock search params
    // Mock other hooks like useParams, useSelectedLayoutSegment(s) if used in tested components
    // useParams: () => ({}),
    // useSelectedLayoutSegment: () => null,
    // redirect: vi.fn((path: string) => { throw new Error(`NEXT_REDIRECT ${path}`); }), // For testing redirects
    // notFound: vi.fn(() => { throw new Error('NEXT_NOT_FOUND'); }), // For testing notFound()
  };
});

// Mock `next/font/*` functions (e.g., Inter, Roboto from next/font/google)
// This prevents errors in tests when components use these font functions.
vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'font-inter-mock', style: { fontFamily: 'inter-mock' } }),
  Roboto: () => ({ className: 'font-roboto-mock', style: { fontFamily: 'roboto-mock' } }),
  // Add mocks for other fonts used in your application
}));


console.log('Vitest global setup file loaded for @bookmark-todo-app/web.');

// Optional: You can set up a global `afterEach` to cleanup testing-library renders
// import { cleanup } from '@testing-library/react';
// afterEach(() => {
//   cleanup();
// });
