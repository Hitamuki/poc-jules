import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// This configures a Service Worker with the given request handlers.
// The worker instance should be started by calling `worker.start()`.
// For Next.js, this is typically done in `_app.tsx` or a similar global setup file,
// conditionally for development environments.
export const worker = setupWorker(...handlers);

// You can also add a way to conditionally start the worker for development:
// async function enableMocking() {
//   if (process.env.NODE_ENV !== 'development') {
//     return;
//   }
//   // Make sure the service worker is successfully registered.
//   await worker.start({
//     onUnhandledRequest: 'bypass', // or 'warn' or a custom function
//     // quiet: true, // Suppress console messages from MSW
//   });
//   console.log('MSW worker started for browser.');
// }

// Call enableMocking in your app's entry point, e.g., _app.tsx or a client-side layout component.
// enableMocking();
// For Storybook, msw-storybook-addon handles starting the worker.
