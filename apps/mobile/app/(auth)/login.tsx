import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter, Link } from 'expo-router';
// import { useAuth } from '../../hooks/useAuth'; // Example custom auth hook for actual logic

export default function LoginScreen() {
  const router = useRouter();
  // const { login, isLoading: authIsLoading } = useAuth(); // Example
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Local loading state for UI feedback

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Login Error", "Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    try {
      // Replace with actual login logic using your auth service/hook
      // For example: const result = await login(email, password);
      console.log('Attempting login with:', email); // Avoid logging password in real apps
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Mock success or failure
      if (email === "test@example.com" && password === "password123") {
        Alert.alert("Login Success (Mock)", "Welcome back!");
        // On successful login, navigate to the main app
        router.replace('/(tabs)/dashboard'); // Ensure this route exists
      } else {
        Alert.alert("Login Failed (Mock)", "Invalid email or password.");
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Sign In' }} />
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue your journey.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          placeholderTextColor="#888"
          returnKeyType="next"
          // onSubmitEditing={() => passwordInputRef.current?.focus()} // Focus next input
        />
        <TextInput
          // ref={passwordInputRef} // For focusing from previous input
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#888"
          returnKeyType="done"
          onSubmitEditing={handleLogin} // Allow login on submit
        />
        <Pressable
          style={({ pressed }) => [
            styles.button,
            isLoading && styles.buttonDisabled,
            pressed && !isLoading && styles.buttonPressed,
          ]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </Pressable>

        <Link href="/(auth)/forgot-password" asChild>
          <Pressable style={styles.linkButton} disabled={isLoading}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </Pressable>
        </Link>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Link href="/(auth)/register" asChild>
            <Pressable disabled={isLoading}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25, // Increased padding
    backgroundColor: '#ffffff', // Clean white background
  },
  title: {
    fontSize: 32, // Larger title
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50', // Darker, more professional color
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d', // Softer subtitle color
    marginBottom: 35,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#bdc3c7', // Lighter border color
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 18, // Slightly more space
    fontSize: 16,
    backgroundColor: '#ecf0f1', // Very light input background
    color: '#2c3e50',
  },
  button: {
    width: '100%',
    backgroundColor: '#3498db', // A nice blue
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15, // Space before forgot password link
    minHeight: 50, // Ensure button has consistent height with ActivityIndicator
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: '#2980b9', // Darker blue on press
  },
  buttonDisabled: {
    backgroundColor: '#95a5a6', // Muted color when disabled
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    paddingVertical: 10, // Make it easier to press
  },
  linkText: {
    color: '#3498db',
    fontSize: 14,
  },
  footer: {
    // position: 'absolute', // Removed absolute positioning for better flow with KeyboardAvoidingView
    // bottom: Platform.OS === 'ios' ? 40 : 20, // Adjust based on OS if absolute
    paddingTop: 20, // Add some space if not absolute
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#ecf0f1',
    borderTopWidth: 1,
    width: '100%',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  footerLink: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
