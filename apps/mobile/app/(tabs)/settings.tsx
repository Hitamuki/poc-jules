import React from 'react';
import { View, Text, StyleSheet, Button, Switch, Pressable, Alert } from 'react-native';
// import { useAtom } from 'jotai';
// import { themeAtom, notificationsAtom } from '../../store/settingsAtoms'; // Example Jotai atoms
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  // const [theme, setTheme] = useAtom(themeAtom);
  // const [notificationsEnabled, setNotificationsEnabled] = useAtom(notificationsAtom);
  const [isDarkTheme, setIsDarkTheme] = React.useState(false); // Local state for example
  const [notificationsOn, setNotificationsOn] = React.useState(true); // Local state

  const toggleThemeSwitch = () => setIsDarkTheme(previousState => !previousState);
  const toggleNotificationSwitch = () => setNotificationsOn(previousState => !previousState);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => {
            // Perform actual logout logic here (clear tokens, reset state)
            console.log("User logged out");
            // Redirect to login screen
            // router.replace('/(auth)/login'); // Assuming you have an auth flow
            alert("Logout functionality to be implemented!");
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDarkTheme ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleThemeSwitch}
            value={isDarkTheme}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Enable Notifications</Text>
          <Switch
            onValueChange={toggleNotificationSwitch}
            value={notificationsOn}
          />
        </View>
        <Pressable style={styles.subSettingItem} onPress={() => alert("Navigate to Notification Preferences")}>
          <Text style={styles.settingText}>Notification Preferences</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Pressable style={styles.subSettingItem} onPress={() => alert("Navigate to Profile Edit")}>
          <Text style={styles.settingText}>Edit Profile</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </Pressable>
        <Pressable style={styles.subSettingItem} onPress={() => alert("Navigate to Change Password")}>
          <Text style={styles.settingText}>Change Password</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: 30 }}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#f5f5f5', // Light background for settings
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  subSettingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  arrow: {
    fontSize: 18,
    color: '#888',
  }
});
