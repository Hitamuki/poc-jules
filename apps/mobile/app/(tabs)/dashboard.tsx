import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar'; // For controlling status bar style

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <StatusBar style="auto" /> {/* Or "light", "dark" */}
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Welcome to your Bookmark ToDo App!</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Stats</Text>
        <Text style={styles.cardText}>Total Bookmarks: 120</Text>
        <Text style={styles.cardText}>Pending Tasks: 15</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Activity</Text>
        <Text style={styles.cardText}>- Added "Expo Router Guide"</Text>
        <Text style={styles.cardText}>- Completed "Learn Jotai"</Text>
      </View>

      <Link href="/modal" style={styles.link}>
        <Text style={styles.linkText}>Open Info Modal</Text>
      </Link>
      <Link href="/(tabs)/bookmarks" style={styles.link}>
        <Text style={styles.linkText}>Go to Bookmarks</Text>
      </Link>
       <Link href="/(auth)/login" style={styles.link}>
        <Text style={styles.linkText}>Go to Login (Example)</Text>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light gray background for the scroll view
  },
  container: {
    // flex: 1, // Remove if using ScrollView for content to scroll
    justifyContent: 'flex-start', // Align content to the top
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 25,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  link: {
    marginTop: 15,
    paddingVertical: 10,
  },
  linkText: {
    color: '#2f95dc',
    fontSize: 16,
    fontWeight: '500',
  }
});
