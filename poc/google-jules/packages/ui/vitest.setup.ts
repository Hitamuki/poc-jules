import '@testing-library/jest-dom/vitest'; // Extends Vitest's expect with jest-dom matchers
import { vi } from 'vitest'; // Import vi for mocking

// --- Global Mocks & Setup ---

// Example: Mock matchMedia for components that might use it (e.g., for responsive hooks)
// This is a common setup for testing components that adapt to screen sizes.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false, // Default to not matching, can be overridden in specific tests
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated but sometimes used by older libraries
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Example: Mock IntersectionObserver for components that use it (e.g., for lazy loading, infinite scroll)
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: mockIntersectionObserver,
});


// Example: Mock ResizeObserver
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


// If you are using MSW for mocking API calls in your component tests (within this UI package),
// you would set it up here. However, UI components should ideally not make direct API calls.
// If they do, or if they are container components tested here:
//
// import { server } from './src/mocks/server'; // Assuming you have a specific MSW server setup for this package
//
// beforeAll(() => {
//   // Establish API mocking before all tests.
//   // The 'onUnhandledRequest: 'error'' option will make tests fail on unhandled requests.
//   server.listen({ onUnhandledRequest: 'error' });
// });
//
// afterEach(() => {
//   // Reset any request handlers that we may add during the tests,
//   // so they don't affect other tests.
//   server.resetHandlers();
// });
//
// afterAll(() => {
//   // Clean up after the tests are finished.
//   server.close();
// });

// You can add any other global setup needed for your tests here.
// For example, if you use a i18n library, you might initialize it here.

console.log('Vitest setup file loaded for @bookmark-todo-app/ui');
