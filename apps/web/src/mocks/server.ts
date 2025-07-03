import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// This configures a request mocking server for use in Node.js environments (e.g., Vitest, Jest).
// The server should be started before tests run (e.g., in a setup file)
// and closed after tests complete.
export const server = setupServer(...handlers);

// Example usage in a test setup file (e.g., vitest.setup.ts or jest.setup.js):
//
// import { server } from './mocks/server'; // Adjust path as needed
//
// beforeAll(() => server.listen({ onUnhandledRequest: 'error' })); // Listen before all tests
// afterEach(() => server.resetHandlers()); // Reset any runtime request handlers added during tests
// afterAll(() => server.close()); // Clean up once tests are done
//
// // To use in individual test files if specific handlers are needed:
// // server.use(
// //   http.get('/api/specific-endpoint', () => HttpResponse.json({ data: 'specific' }))
// // );
