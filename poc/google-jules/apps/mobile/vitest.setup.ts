import '@testing-library/jest-native/extend-expect'; // Extends Vitest's expect with jest-native matchers
import { vi } from 'vitest';

// --- Global Mocks for React Native & Expo ---
// Vitest runs in a Node.js environment, so native modules and components need to be mocked.

// Mock react-native core components and APIs as needed
vi.mock('react-native', async (importOriginal) => {
  const actualReactNative = await importOriginal<typeof import('react-native')>();
  return {
    ...actualReactNative,
    StyleSheet: {
      ...actualReactNative.StyleSheet,
      create: vi.fn((styles) => styles), // Passthrough for StyleSheet.create
    },
    View: 'View', // Simple string mocks for common components
    Text: 'Text',
    Pressable: 'Pressable',
    TextInput: 'TextInput',
    Button: 'Button',
    FlatList: 'FlatList',
    ScrollView: 'ScrollView',
    ActivityIndicator: 'ActivityIndicator',
    KeyboardAvoidingView: 'KeyboardAvoidingView',
    Switch: 'Switch',
    Image: 'Image',
    // Mock other RN components/APIs your app uses
    Platform: {
      ...actualReactNative.Platform,
      OS: 'ios', // Default mock OS, can be changed in tests
      Version: '15.0',
      select: (spec: any) => (spec.ios !== undefined ? spec.ios : spec.default),
    },
    Alert: {
      ...actualReactNative.Alert,
      alert: vi.fn(),
    },
    // Dimensions: { // Mock Dimensions if used
    //   get: vi.fn(() => ({ width: 375, height: 667, scale: 2, fontScale: 1 })),
    // },
    // AppState: { // Mock AppState if used
    //   currentState: 'active',
    //   addEventListener: vi.fn(),
    //   removeEventListener: vi.fn(),
    // },
  };
});

// Mock react-native-gesture-handler
vi.mock('react-native-gesture-handler', () => {
  const View = 'View'; // Using string mock from above
  return {
    GestureHandlerRootView: View, // Important for root component
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: vi.fn((comp) => comp), // Passthrough HOC
    Directions: {},
  };
});

// Mock expo-router
vi.mock('expo-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('expo-router')>();
  const MockLink = ({ href, children, ...props }: any) => React.createElement('Link', { ...props, href }, children);
  const MockStackScreen = ({ name, options }: any) => React.createElement('Stack.Screen', { name, options });
  const MockTabsScreen = ({ name, options }: any) => React.createElement('Tabs.Screen', { name, options });


  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn((href: string) => console.log(`Mocked router.push to ${href}`)),
      replace: vi.fn((href: string) => console.log(`Mocked router.replace with ${href}`)),
      back: vi.fn(() => console.log('Mocked router.back')),
      navigate: vi.fn(),
      setParams: vi.fn(),
      canGoBack: () => true,
    }),
    useLocalSearchParams: () => ({}),
    useGlobalSearchParams: () => ({}),
    usePathname: () => '/mock-path',
    Link: MockLink,
    Redirect: ({ href }: { href: string }) => React.createElement('Redirect', { href }),
    Stack: { ...actual.Stack, Screen: MockStackScreen },
    Tabs: { ...actual.Tabs, Screen: MockTabsScreen },
    SplashScreen: { preventAutoHideAsync: vi.fn(), hideAsync: vi.fn() },
    ErrorBoundary: ({ children } : {children: React.ReactNode}) => React.createElement(React.Fragment, null, children),
  };
});

// Mock @expo/vector-icons (since installation was skipped)
// This prevents tests from crashing if components try to render these icons.
vi.mock('@expo/vector-icons', () => ({
  Ionicons: (props: any) => React.createElement('Ionicons', props),
  FontAwesome: (props: any) => React.createElement('FontAwesome', props),
  MaterialCommunityIcons: (props: any) => React.createElement('MaterialCommunityIcons', props),
  // Add other icon sets if used
}));

// Mock expo-font
vi.mock('expo-font', () => ({
  useFonts: () => [true, null], // Assume fonts are loaded and no error
  loadAsync: () => Promise.resolve(),
}));

// Mock expo-asset
vi.mock('expo-asset', () => ({
  Asset: {
    fromModule: (moduleId: number) => ({
      uri: `mock-asset-uri-${moduleId}`,
      name: 'mock-asset',
      type: 'mock',
      downloadAsync: vi.fn(() => Promise.resolve()),
    }),
    loadAsync: (assetIds: number | number[]) => Promise.resolve(), // Mock implementation
  },
}));

// Mock react-native-safe-area-context
vi.mock('react-native-safe-area-context', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-native-safe-area-context')>();
  return {
    ...actual,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children), // Pass through children
    // Mock other exports if needed
  };
});

// Mock expo-status-bar
vi.mock('expo-status-bar', () => ({
    StatusBar: (props: any) => React.createElement('StatusBar', props)
}));

// Mock expo-constants
vi.mock('expo-constants', async (importOriginal) => {
    const actual = await importOriginal<typeof import('expo-constants')>();
    return {
        ...actual,
        manifest: { extra: {} }, // Provide a basic mock for manifest.extra
        // Add other constants if your app uses them from here
    };
});

// Mock expo-linking
vi.mock('expo-linking', () => ({
    createURL: vi.fn((path) => `exp://mock-host/${path}`),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    openURL: vi.fn(() => Promise.resolve()),
    // Add other exports if used
}));


console.log('Vitest global setup file loaded for @bookmark-todo-app/mobile.');

// Optional: Global cleanup for testing-library if needed, though Vitest often handles this well.
// import { cleanup } from '@testing-library/react-native';
// afterEach(() => {
//   cleanup();
// });
