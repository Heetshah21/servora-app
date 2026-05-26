import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from "react-native";

import { useEffect, useState } from "react";

import axios from "axios";

import { router } from "expo-router";

import { useAuth } from "../../context/AuthContext";

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [restaurant, setRestaurant] =
    useState<any>(null);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  async function fetchSettings() {
    try {
      if (!user) return;

      setLoading(true);

      const res = await axios.get(
        "https://servora-sable.vercel.app/api/settings",
        {
          params: {
            tenantId: user.tenantId,
            restaurantId:
              user.restaurantId,
          },
        }
      );

      setRestaurant(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    try {
      setSaving(true);

      await axios.post(
        "https://servora-sable.vercel.app/api/settings",
        {
          restaurantId:
            restaurant.id,

          name: restaurant.name,

          currency:
            restaurant.currency,

          taxPercent:
            restaurant.taxPercent,

          servicePercent:
            restaurant.servicePercent,

          phone: restaurant.phone,

          upiId: restaurant.upiId,

          acceptsDineIn:
            restaurant.acceptsDineIn,

          acceptsTakeaway:
            restaurant.acceptsTakeaway,

          acceptsDelivery:
            restaurant.acceptsDelivery,
        }
      );

      Alert.alert(
        "Success",
        "Settings updated"
      );
    } catch (err) {
      console.log(err);

      Alert.alert(
        "Error",
        "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    try {
      const res = await axios.post(
        "https://servora-sable.vercel.app/api/settings/password",
        {
          userId: user?.id,

          currentPassword,

          newPassword,

          confirmPassword,
        }
      );

      if (res.data.error) {
        Alert.alert(
          "Error",
          res.data.error
        );

        return;
      }

      Alert.alert(
        "Success",
        "Password changed"
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      Alert.alert(
        "Error",
        "Something went wrong"
      );
    }
  }

  useEffect(() => {
    fetchSettings();
  }, [user]);

  if (loading || !restaurant) {
    return null;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
    >
      <Text style={styles.title}>
        Settings
      </Text>

      {/* Restaurant Settings */}

      <View style={styles.section}>
  <Text style={styles.sectionTitle}>
    Restaurant Settings
  </Text>

  <Text style={styles.label}>
    Restaurant Name
  </Text>

  <TextInput
    value={restaurant.name}
    onChangeText={(text) =>
      setRestaurant({
        ...restaurant,
        name: text,
      })
    }
    style={styles.input}
  />

  <Text style={styles.label}>
    Currency
  </Text>

  <TextInput
    value={restaurant.currency}
    onChangeText={(text) =>
      setRestaurant({
        ...restaurant,
        currency: text,
      })
    }
    style={styles.input}
  />

  <Text style={styles.label}>
    Tax Percentage
  </Text>

  <TextInput
    value={String(
      restaurant.taxPercent
    )}
    onChangeText={(text) =>
      setRestaurant({
        ...restaurant,
        taxPercent: text,
      })
    }
    style={styles.input}
  />

  <Text style={styles.label}>
    Service Charge Percentage
  </Text>

  <TextInput
    value={String(
      restaurant.servicePercent
    )}
    onChangeText={(text) =>
      setRestaurant({
        ...restaurant,
        servicePercent: text,
      })
    }
    style={styles.input}
  />

  <Text style={styles.label}>
    Phone Number
  </Text>

  <TextInput
    value={restaurant.phone || ""}
    onChangeText={(text) =>
      setRestaurant({
        ...restaurant,
        phone: text,
      })
    }
    style={styles.input}
  />

  <Text style={styles.label}>
    UPI ID
  </Text>

  <TextInput
    value={restaurant.upiId || ""}
    onChangeText={(text) =>
      setRestaurant({
        ...restaurant,
        upiId: text,
      })
    }
    style={styles.input}
  />

  <View style={styles.switchRow}>
    <Text style={styles.switchText}>
      Accept Dine-In
    </Text>

    <Switch
      value={
        restaurant.acceptsDineIn
      }
      onValueChange={(val) =>
        setRestaurant({
          ...restaurant,
          acceptsDineIn: val,
        })
      }
    />
  </View>

  <View style={styles.switchRow}>
    <Text style={styles.switchText}>
      Accept Takeaway
    </Text>

    <Switch
      value={
        restaurant.acceptsTakeaway
      }
      onValueChange={(val) =>
        setRestaurant({
          ...restaurant,
          acceptsTakeaway: val,
        })
      }
    />
  </View>

  <View style={styles.switchRow}>
    <Text style={styles.switchText}>
      Accept Delivery
    </Text>

    <Switch
      value={
        restaurant.acceptsDelivery
      }
      onValueChange={(val) =>
        setRestaurant({
          ...restaurant,
          acceptsDelivery: val,
        })
      }
    />
  </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveSettings}
        disabled={saving}
      >
        <Text style={styles.saveText}>
          {saving
            ? "Saving..."
            : "Save Settings"}
        </Text>
      </TouchableOpacity>
    </View>


      {/* Password Section */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Change Password
        </Text>

        <TextInput
          placeholder="Current Password"
          secureTextEntry
          value={currentPassword}
          onChangeText={
            setCurrentPassword
          }
          style={styles.input}
        />

        <TextInput
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.input}
        />

        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={
            setConfirmPassword
          }
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={changePassword}
        >
          <Text style={styles.saveText}>
            Change Password
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6f8",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },

  section: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 2,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 18,
    color: "#111827",
  },

  input: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },

  switchRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: 18,
  },

  switchText: {
    fontSize: 16,
    color: "#111827",
  },

  saveButton: {
    backgroundColor: "#111827",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  saveText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
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
  label: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
    marginLeft: 2,
  },
});