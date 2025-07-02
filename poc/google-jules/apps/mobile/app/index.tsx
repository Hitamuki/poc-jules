import React from 'react';
import { Redirect } from 'expo-router';

/**
 * This is the root entry point for the `app` directory.
 * It can be used to:
 * 1. Redirect to the primary section of your app (e.g., main tabs, dashboard).
 * 2. Conditionally redirect based on authentication state.
 * 3. Show a global loading/splash screen if not handled by RootLayout's SplashScreen.
 *
 * For this boilerplate, we are redirecting to the '(tabs)/dashboard' route.
 */
export default function AppRootIndex() {
  // Example: Redirect to the dashboard tab.
  // Ensure `(tabs)/dashboard.tsx` exists and is configured in `(tabs)/_layout.tsx`.
  return <Redirect href="/(tabs)/dashboard" />;

  // --- ALTERNATIVE EXAMPLES ---

  // Example: Conditional redirect based on authentication state
  // const { user, isLoading } = useAuth(); // Replace with your actual auth hook
  // if (isLoading) {
  //   return <LoadingIndicator />; // Or null, if SplashScreen is still visible
  // }
  // if (!user) {
  //   return <Redirect href="/(auth)/login" />; // Redirect to login if not authenticated
  // }
  // return <Redirect href="/(tabs)/dashboard" />; // Proceed to app if authenticated

  // Example: Showing a simple text while RootLayout's SplashScreen might still be active
  // return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Loading App...</Text></View>;
}
