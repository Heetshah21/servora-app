import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";

import { useAuth } from "../../context/AuthContext";

export default function SettingsScreen() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Settings
      </Text>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          await logout();

          router.replace("/login");
        }}
      >
        <Text style={styles.logoutText}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f6f8",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 30,
  },

  logoutButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  logoutText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});