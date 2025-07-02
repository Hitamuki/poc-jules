import { View, Text, StyleSheet, Button, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router'; // useRouter to go back
import { StatusBar } from 'expo-status-bar';

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Control status bar style specifically for this modal if needed */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

      {/*
        The title for this modal can be set in a few ways:
        1. In the <Stack.Screen name="modal" options={{ title: '...' }} /> in `app/_layout.tsx`. (Recommended for static titles)
        2. Dynamically using <Stack.Screen options={{ title: 'Dynamic Title' }} /> here.
        If options are set in both places, the options in the screen component take precedence.
      */}
      {/* <Stack.Screen options={{ title: 'Information' }} /> */}

      <Text style={styles.title}>Info / Help Modal</Text>
      <Text style={styles.subtitle}>
        This screen is presented modally. You can put any content here,
        like help information, a form, or specific actions.
      </Text>
      <View style={styles.separator} />
      <Text style={styles.text}>
        To close this modal, press the button below or use the native dismiss gesture (e.g., swipe down on iOS).
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Close Modal" onPress={() => router.back()} color={Platform.OS === 'ios' ? '#007AFF' : undefined} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30, // Increased padding
    backgroundColor: '#f8f9fa', // Light background for modal
  },
  title: {
    fontSize: 22, // Larger title
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#343a40', // Darker text
  },
  subtitle: {
    fontSize: 16, // Larger subtitle
    color: '#495057', // Medium-dark text
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 14,
    color: '#6c757d', // Lighter text
    textAlign: 'center',
    lineHeight: 20,
  },
  separator: {
    marginVertical: 25,
    height: 1,
    width: '80%',
    backgroundColor: '#dee2e6', // Light separator line
  },
  buttonContainer: {
    marginTop: 25,
    width: '60%', // Give button a defined width
  }
});
