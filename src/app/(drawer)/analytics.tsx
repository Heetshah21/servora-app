import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
  } from "react-native";
  
  import { useEffect, useState } from "react";
  
  import axios from "axios";
  
  import { useAuth } from "../../context/AuthContext";
  
  export default function AnalyticsScreen() {
    const { user } = useAuth();
  
    const [range, setRange] =
      useState("today");
  
    const [loading, setLoading] =
      useState(false);
  
    const [data, setData] = useState<any>(
      null
    );
  
    const [fromDate, setFromDate] =
      useState("");
  
    const [toDate, setToDate] =
      useState("");
  
    async function loadData(
      selectedRange: string
    ) {
      try {
        if (!user) return;
  
        setLoading(true);
  
        const params: any = {
          tenantId: user.tenantId,
          restaurantId: user.restaurantId,
          range: selectedRange,
        };
  
        if (
          selectedRange === "custom" &&
          fromDate &&
          toDate
        ) {
          params.from = fromDate;
          params.to = toDate;
        }
  
        const res = await axios.get(
          "https://servora-sable.vercel.app/api/dashboard/analytics",
          {
            params,
          }
        );
  
        setData(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  
    useEffect(() => {
      loadData(range);
    }, [user]);
  
    const ranges = [
      {
        label: "Today",
        value: "today",
      },
  
      {
        label: "Yesterday",
        value: "yesterday",
      },
  
      {
        label: "7D",
        value: "7d",
      },
  
      {
        label: "30D",
        value: "30d",
      },
  
      {
        label: "Custom",
        value: "custom",
      },
    ];
  
    const cards = data
      ? [
          {
            title: "Total Orders",
            value: data.totalOrders,
          },
  
          {
            title: "Completed Orders",
            value: data.completedOrders,
          },
  
          {
            title: "Revenue",
            value: `₹${data.revenue}`,
          },
  
          {
            title: "Avg Order Value",
            value: `₹${data.avgOrderValue}`,
          },
        ]
      : [];
  
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <Text style={styles.restaurantName}>
              Kings Frankie
            </Text>
  
            <Text style={styles.pageTitle}>
              Analytics
            </Text>
          </View>
  
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.rangeContainer
            }
          >
            {ranges.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.rangeButton,
                  range === item.value &&
                    styles.activeRange,
                ]}
                onPress={async () => {
                  setRange(item.value);
  
                  if (
                    item.value !== "custom"
                  ) {
                    await loadData(
                      item.value
                    );
                  }
                }}
              >
                <Text
                  style={[
                    styles.rangeText,
                    range === item.value &&
                      styles.activeRangeText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
  
          {range === "custom" && (
            <View style={styles.customContainer}>
              <TextInput
                placeholder="From (YYYY-MM-DD)"
                value={fromDate}
                onChangeText={setFromDate}
                style={styles.input}
              />
  
              <TextInput
                placeholder="To (YYYY-MM-DD)"
                value={toDate}
                onChangeText={setToDate}
                style={styles.input}
              />
  
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() =>
                  loadData("custom")
                }
              >
                <Text
                  style={styles.applyText}
                >
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          )}
  
          {loading ? (
            <Text style={styles.loading}>
              Loading...
            </Text>
          ) : (
            <View style={styles.grid}>
              {cards.map((card) => (
                <View
                  key={card.title}
                  style={styles.card}
                >
                  <Text
                    style={styles.cardTitle}
                  >
                    {card.title}
                  </Text>
  
                  <Text
                    style={styles.cardValue}
                  >
                    {card.value}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f6f8",
    },
  
    content: {
      padding: 16,
      paddingBottom: 40,
    },
  
    header: {
      marginBottom: 20,
    },
  
    restaurantName: {
      fontSize: 24,
      fontWeight: "700",
      color: "#111827",
    },
  
    pageTitle: {
      fontSize: 15,
      color: "#6b7280",
      marginTop: 2,
    },
  
    rangeContainer: {
      gap: 10,
      marginBottom: 20,
    },
  
    rangeButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: "white",
      borderRadius: 10,
    },
  
    activeRange: {
      backgroundColor: "#111827",
    },
  
    rangeText: {
      color: "#111827",
      fontWeight: "600",
    },
  
    activeRangeText: {
      color: "white",
    },
  
    customContainer: {
      gap: 10,
      marginBottom: 20,
    },
  
    input: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 14,
    },
  
    applyButton: {
      backgroundColor: "#111827",
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
    },
  
    applyText: {
      color: "white",
      fontWeight: "700",
    },
  
    loading: {
      marginTop: 20,
      color: "#6b7280",
    },
  
    grid: {
      gap: 14,
    },
  
    card: {
      backgroundColor: "white",
      borderRadius: 16,
      padding: 20,
  
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 10,
  
      elevation: 2,
    },
  
    cardTitle: {
      color: "#6b7280",
      fontSize: 14,
      marginBottom: 10,
    },
  
    cardValue: {
      fontSize: 32,
      fontWeight: "700",
      color: "#111827",
    },
  });