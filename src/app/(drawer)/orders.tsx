import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
  } from "react-native";
  
  import { useEffect, useState } from "react";
  
  import axios from "axios";
  
  import { router } from "expo-router";
  
  import { useAuth } from "../../context/AuthContext";
  
  export default function OrdersScreen() {
    const { user, loading, logout } = useAuth();
  
    const [orders, setOrders] = useState<any[]>([]);
  
    async function fetchOrders() {
      try {
        if (!user) return;
  
        const res = await axios.get(
          "https://servora-sable.vercel.app/api/orders/list",
          {
            params: {
              tenantId: user.tenantId,
              restaurantId: user.restaurantId,
            },
          }
        );
  
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      }
    }
  
    useEffect(() => {
      if (loading) return;
  
      if (!user) {
        router.replace("/login");
        return;
      }
  
      fetchOrders();
  
      const interval = setInterval(fetchOrders, 5000);
  
      return () => clearInterval(interval);
    }, [user, loading]);
  
    if (loading || !user) {
      return null;
    }
  
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.restaurantName}>
            Kings Frankie
          </Text>

          <Text style={styles.pageTitle}>
            Orders
          </Text>
        </View>
  
        <ScrollView contentContainerStyle={styles.ordersContainer}>
          {orders.map((order) => (
            <View
              key={order.id}
              style={styles.orderCard}
            >
              <View style={styles.row}>
                <Text style={styles.orderId}>
                  #{order.orderCode}
                </Text>
  
                <View
                  style={[
                    styles.badge,
                    order.status === "READY"
                      ? styles.readyBadge
                      : styles.pendingBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      order.status === "READY"
                        ? styles.readyText
                        : styles.pendingText,
                    ]}
                  >
                    {order.status}
                  </Text>
                </View>
              </View>
  
              <Text style={styles.tableText}>
                {order.tableNumber
                  ? `Table ${order.tableNumber}`
                  : order.source}
              </Text>
  
              <View style={styles.itemsContainer}>
                {order.items.map((item: any) => (
                  <Text
                    key={item.id}
                    style={styles.item}
                  >
                    • {item.name} × {item.quantity}
                  </Text>
                ))}
              </View>
  
              <Text style={styles.total}>
                ₹{Number(order.total)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f6f8",
    },
  
    header: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: "white",
      borderBottomWidth: 1,
      borderBottomColor: "#e5e7eb",
  
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: "#111827",
    },
    
    ordersContainer: {
      padding: 16,
      gap: 16,
    },
  
    orderCard: {
      backgroundColor: "white",
      borderRadius: 16,
      padding: 16,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
  
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  
    orderId: {
      fontSize: 20,
      fontWeight: "700",
      color: "#111827",
    },
  
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
    },
  
    pendingBadge: {
      backgroundColor: "#fef3c7",
    },
  
    pendingText: {
      color: "#92400e",
    },
  
    readyBadge: {
      backgroundColor: "#dcfce7",
    },
  
    readyText: {
      color: "#166534",
    },
  
    badgeText: {
      fontWeight: "700",
      fontSize: 12,
    },
  
    tableText: {
      marginTop: 10,
      fontSize: 15,
      color: "#6b7280",
    },
  
    itemsContainer: {
      marginTop: 14,
      gap: 6,
    },
  
    item: {
      fontSize: 15,
      color: "#111827",
    },
  
    total: {
      marginTop: 16,
      fontSize: 24,
      fontWeight: "700",
      color: "#111827",
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
  });