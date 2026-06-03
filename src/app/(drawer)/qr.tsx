import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
  } from "react-native";
  
  import {
    useState,
    useEffect,
  } from "react";
  
  import axios from "axios";
  
  import QRCode from "react-native-qrcode-svg";
  
  import { useAuth } from "../../context/AuthContext";
  
  export default function QRScreen() {
    const { user } = useAuth();
  
    const [count, setCount] =
      useState("");
  
    const [qrs, setQrs] = useState<
      any[]
    >([]);
  
    const [shortCode, setShortCode] =
      useState("");
  
    useEffect(() => {
      async function loadRestaurant() {
        try {
          if (!user) return;
  
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
  
          setShortCode(
            res.data.shortCode
          );
        } catch (err) {
          console.log(err);
        }
      }
  
      loadRestaurant();
    }, [user]);
  
    function generateQRs() {
      if (!user || !shortCode)
        return;
  
      const total = Number(count);
  
      const arr = [];
  
      const baseUrl =
        "https://servora-sable.vercel.app";
  
      // Table QR Codes
      for (
        let i = 1;
        i <= total;
        i++
      ) {
        const url = `${baseUrl}/m/${shortCode}?table=${i}`;
  
        arr.push({
          title: `Table ${i}`,
          url,
        });
      }
  
      // Generic Customer QR
      arr.push({
        title: "Customer Ordering",
        url: `${baseUrl}/m/${shortCode}`,
      });
  
      setQrs(arr);
    }
  
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.content
        }
      >
        <Text style={styles.title}>
          QR Generator
        </Text>
  
        <TextInput
          placeholder="Number of Tables"
          value={count}
          onChangeText={setCount}
          keyboardType="numeric"
          style={styles.input}
        />
  
        <TouchableOpacity
          style={styles.button}
          onPress={generateQRs}
        >
          <Text style={styles.buttonText}>
            Generate QR Codes
          </Text>
        </TouchableOpacity>
  
        <View style={styles.qrContainer}>
          {qrs.map((q) => (
            <View
              key={q.title}
              style={styles.qrCard}
            >
              <Text style={styles.qrTitle}>
                {q.title}
              </Text>
  
              <QRCode
                value={q.url}
                size={180}
              />
  
              <Text style={styles.url}>
                {q.url}
              </Text>
            </View>
          ))}
        </View>
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
    },
  
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: "#111827",
      marginBottom: 20,
    },
  
    input: {
      backgroundColor: "white",
      borderRadius: 12,
      padding: 14,
      marginBottom: 16,
    },
  
    button: {
      backgroundColor: "#111827",
      paddingVertical: 15,
      borderRadius: 12,
      alignItems: "center",
    },
  
    buttonText: {
      color: "white",
      fontWeight: "700",
      fontSize: 16,
    },
  
    qrContainer: {
      marginTop: 24,
      gap: 20,
    },
  
    qrCard: {
      backgroundColor: "white",
      borderRadius: 18,
      padding: 20,
      alignItems: "center",
  
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 10,
  
      elevation: 2,
    },
  
    qrTitle: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 20,
      color: "#111827",
    },
  
    url: {
      marginTop: 16,
      color: "#6b7280",
      textAlign: "center",
      fontSize: 12,
    },
  });