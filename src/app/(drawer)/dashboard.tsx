  import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
  } from "react-native";

  import { useEffect, useState } from "react";

  import axios from "axios";

  import { useAuth } from "../../context/AuthContext";

  export default function DashboardScreen() {
    const { user } = useAuth();
    console.log("USER =", user);
    const [analytics, setAnalytics] = useState<any>(
      null
    );

    async function fetchAnalytics() {
      try {
        if (!user) return;

        const res = await axios.get(
          "https://servora-sable.vercel.app/api/dashboard/summary",
          {
            params: {
              tenantId: user.tenantId,
              restaurantId: user.restaurantId,
            },
          }
        );

        setAnalytics(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    useEffect(() => {
      fetchAnalytics();

      const interval = setInterval(
        fetchAnalytics,
        10000
      );

      return () => clearInterval(interval);
    }, [user]);

    if (!analytics) {
      return (
        <SafeAreaView style={styles.container}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#6b7280",
                fontSize: 16,
              }}
            >
              Loading dashboard...
            </Text>
          </View>
        </SafeAreaView>
      );
    }

    const cards = [
      {
        title: "Orders Today",
        value: analytics.ordersToday,
      },

      {
        title: "Active Orders",
        value: analytics.activeOrders,
      },

      {
        title: "Completed Orders",
        value: analytics.completedOrders,
      },

      {
        title: "Pending Orders",
        value: analytics.pendingOrders,
      },

      {
        title: "Ready Orders",
        value: analytics.readyOrders,
      },

      {
        title: "Revenue Today",
        value: `₹${analytics.revenueToday}`,
      },

      {
        title: "Avg Order Value",
        value: `₹${analytics.avgOrderValue}`,
      },

      {
        title: "Menu Items",
        value: analytics.menuItems,
      },

      {
        title: "Dine-In Orders",
        value: analytics.dineInOrders,
      },

      {
        title: "Takeaway Orders",
        value: analytics.takeawayOrders,
      },

      {
        title: "Delivery Orders",
        value: analytics.deliveryOrders,
      },
    ];

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
              Dashboard
            </Text>
          </View>

          <View style={styles.grid}>
            {cards.map((card) => (
              <View
                key={card.title}
                style={styles.card}
              >
                <Text style={styles.cardTitle}>
                  {card.title}
                </Text>

                <Text style={styles.cardValue}>
                  {card.value}
                </Text>
              </View>
            ))}
          </View>
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