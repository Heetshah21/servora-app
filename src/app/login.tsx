import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
  } from "react-native";
  
  import { useState } from "react";
  import axios from "axios";
  
  import { router } from "expo-router";
  
  import { useAuth } from "../context/AuthContext";
  
  export default function LoginScreen() {
    const { login } = useAuth();
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [tenantSlug, setTenantSlug] = useState("");
  
    const [loading, setLoading] = useState(false);
  
    async function handleLogin() {
      try {
        setLoading(true);
  
        const res = await axios.post(
          "https://servora-sable.vercel.app/api/auth/mobile-login",
          {
            email,
            password,
            tenantSlug,
          }
        );
  
        await login(res.data);
  
        router.replace("/");
      } catch (err: any) {
        Alert.alert(
          "Login Failed",
          err?.response?.data?.error || "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }
  
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Servora Login</Text>
  
        <TextInput
          placeholder="Restaurant Slug"
          value={tenantSlug}
          onChangeText={setTenantSlug}
          style={styles.input}
        />
  
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={styles.input}
        />
  
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
  
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 24,
      backgroundColor: "#f5f6f8",
    },
  
    heading: {
      fontSize: 32,
      fontWeight: "700",
      marginBottom: 32,
      color: "#111827",
    },
  
    input: {
      backgroundColor: "white",
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 14,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: "#e5e7eb",
    },
  
    button: {
      backgroundColor: "#111827",
      paddingVertical: 15,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 8,
    },
  
    buttonText: {
      color: "white",
      fontWeight: "700",
      fontSize: 16,
    },
  });