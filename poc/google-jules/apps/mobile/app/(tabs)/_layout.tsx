import React from 'react';
import { Link, Tabs } from 'expo-router';
import { Pressable, Text, useColorScheme } from 'react-native';
// import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'; // Installation was skipped

// --- Icon Placeholder ---
// Using a simple text placeholder since @expo/vector-icons installation was skipped.
// In a real app, you'd use actual icons from a library.
const IconPlaceholder = (
    { name, color, size, library }:
    { name: string, color?: string, size?: number, library?: string }
) => (
  <Text style={{
    color: color || '#888', // Default color if not provided
    fontSize: size ? size * 0.6 : 14, // Adjust size factor as needed
    fontWeight: 'bold',
    textAlign: 'center',
    width: size || 24, // Ensure the placeholder takes up some space
  }}>
    {name.substring(0, 1).toUpperCase()}
  </Text>
);
// --- End Icon Placeholder ---

// Example color configuration (adapt to your app's theme)
const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: '#2f95dc', // Example active tint color for light mode
    tabIconDefault: '#ccc',
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: '#fff', // Example active tint color for dark mode
    tabIconDefault: '#555',
  },
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const currentThemeColors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: currentThemeColors.tint,
        tabBarInactiveTintColor: currentThemeColors.tabIconDefault,
        // headerShown: false, // Set globally or per screen
        tabBarStyle: {
          backgroundColor: currentThemeColors.background,
          borderTopColor: colorScheme === 'dark' ? '#222' : '#ddd', // Example border
        },
        headerStyle: {
            backgroundColor: currentThemeColors.background,
        },
        headerTintColor: currentThemeColors.text,
      }}
    >
      <Tabs.Screen
        name="dashboard" // Corresponds to dashboard.tsx
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            // <Ionicons name="home-outline" size={size} color={color} />
            <IconPlaceholder name="Dash" color={color} size={size} library="Ionicons" />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable style={{ marginRight: 15 }}>
                {({ pressed }) => (
                  // <FontAwesome5 name="info-circle" size={20} color={currentThemeColors.text} style={{ opacity: pressed ? 0.5 : 1 }} />
                  <IconPlaceholder name="Info" size={20} color={currentThemeColors.text} />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks" // Corresponds to bookmarks.tsx
        options={{
          title: 'Bookmarks',
          tabBarIcon: ({ color, size }) => (
            // <MaterialCommunityIcons name="bookmark-multiple-outline" size={size} color={color} />
            <IconPlaceholder name="Bkmrks" color={color} size={size} library="MCI" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings" // Corresponds to settings.tsx
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            // <Ionicons name="settings-outline" size={size} color={color} />
            <IconPlaceholder name="Prefs" color={color} size={size} library="Ionicons" />
          ),
        }}
      />
    </Tabs>
  );
}
