/** @type {import('next').NextConfig} */

// Dynamically import next-pwa
// This is one way to handle ESM modules that might otherwise cause issues with CJS based Next.js config pre-v14 or certain setups
async function getPwaConfig() {
  const pwa = await import("next-pwa");
  return pwa.default; // .default is typically needed for CJS modules imported into ESM
}

const nextConfig = {
  reactStrictMode: true,
  // experimental: {
  //   typedRoutes: true, // If using Next.js 13.typedRoutes or newer for type-safe routing
  // },
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === "production", // Example: remove console logs in production
  // },
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: '**.example.com', // Example for allowing all subdomains of example.com
  //     },
  //   ],
  // },
};

// Wrap the Next.js config with PWA config only if not in a specific environment like 'test'
// and if next-pwa is intended to be active.
let finalConfig = nextConfig;

if (process.env.NODE_ENV !== 'test') { // Example: Don't run PWA logic during tests
  try {
    const withPWA = await getPwaConfig();
    finalConfig = withPWA({
      dest: "public",
      register: true, // Auto-register service worker
      skipWaiting: true, // Install new service worker without waiting for old one to stop
      disable: process.env.NODE_ENV === "development", // Disable PWA features in development for faster builds/reloads
      // swSrc: 'src/service-worker.js', // If using a custom service worker
      // runtimeCaching: [ ... ] // Define runtime caching strategies for assets and API calls
      // fallbacks -> for offline page support
    })(nextConfig);
    console.log("next-pwa successfully configured.");
  } catch (error) {
    console.warn("Failed to load or configure next-pwa. PWA features might be disabled.", error);
    // Fallback to default nextConfig if PWA setup fails
    finalConfig = nextConfig;
  }
} else {
  console.log("Skipping PWA configuration for TEST environment.");
}

export default finalConfig;
