import React from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { Slot, SplashScreen, Stack } from 'expo-router';
// import { useFonts } from 'expo-font'; // For custom fonts
import { useEffect } from 'react';
// import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
// import { useColorScheme, Platform } from 'react-native'; // Platform can be used for OS specific logic

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const colorScheme = useColorScheme();

  // Example: Custom font loading
  // const [loaded, error] = useFonts({
  //   'YourFont-Regular': require('../assets/fonts/YourFont-Regular.ttf'),
  //   'YourFont-Bold': require('../assets/fonts/YourFont-Bold.ttf'),
  // });

  useEffect(() => {
    // // Hide the splash screen once fonts are loaded or if an error occurs
    // if (loaded || error) {
    //   SplashScreen.hideAsync();
    // }

    // For now, as no specific async resources are loaded here, hide after a brief moment.
    // In a real app, this should be tied to actual resource loading (fonts, initial API calls, etc.)
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500); // Adjust delay or link to actual loading state

    return () => clearTimeout(timer); // Cleanup the timer
  }, [/* loaded, error */]); // Add dependencies if using font loading or other async tasks

  // // Render nothing until fonts are loaded (or an error occurs)
  // if (!loaded && !error) {
  //   return null;
  // }

  return (
    <JotaiProvider>
      {/*
        Optionally wrap with a navigation theme provider if you want to theme
        the navigation elements (header, tab bar) based on system theme.
        <NavThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      */}
      <Stack>
        {/* Main tab navigator, defined in (tabs)/_layout.tsx */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Example of a modal screen, defined in app/modal.tsx */}
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Info Modal',
            // headerStyle: { backgroundColor: colorScheme === 'dark' ? '#333' : '#fff' },
            // headerTitleStyle: { color: colorScheme === 'dark' ? '#fff' : '#000' },
          }}
        />

        {/* Example of an auth screen group, defined in (auth)/login.tsx etc. */}
        {/* This could be part of a different stack or presented differently based on auth state. */}
        {/*
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }} // Auth screens might have their own internal stack/header
        />
        */}
      </Stack>
      {/*
        </NavThemeProvider>
      */}
    </JotaiProvider>
  );
}

// Optional: Define a global error boundary for Expo Router
// export { ErrorBoundary } from 'expo-router';
```
