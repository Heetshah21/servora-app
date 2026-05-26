import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useEffect, useState } from "react";

import axios from "axios";

import { router } from "expo-router";

import { useAuth } from "../../context/AuthContext";

export default function OrdersScreen() {
  const { user, loading } = useAuth();

  const [orders, setOrders] = useState<any[]>([]);

  const [loadingOrderId, setLoadingOrderId] =
    useState<string | null>(null);

  const [hiddenOrders, setHiddenOrders] =
    useState<string[]>([]);

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

      const filteredOrders = res.data.filter(
        (order: any) =>
          !hiddenOrders.includes(order.id)
      );

      setOrders(filteredOrders);
    } catch (err) {
      console.log(err);
    }
  }

  async function updateOrder(
    orderId: string,
    status: string
  ) {
    try {
      setLoadingOrderId(orderId);

      // optimistic UI
      if (status === "CANCELLED") {
        setHiddenOrders((prev) => [
          ...prev,
          orderId,
        ]);

        setOrders((prev: any[]) =>
          prev.filter(
            (order) => order.id !== orderId
          )
        );
      } else {
        setOrders((prev: any[]) =>
          prev.map((order) =>
            order.id === orderId
              ? { ...order, status }
              : order
          )
        );
      }

      await axios.post(
        "https://servora-sable.vercel.app/api/orders/update",
        {
          orderId,
          status,
        }
      );
    } catch (err) {
      console.log(err);

      setHiddenOrders((prev) =>
        prev.filter((id) => id !== orderId)
      );

      fetchOrders();
    } finally {
      setLoadingOrderId(null);
    }
  }

  async function markPaid(
    orderId: string,
    amount: number
  ) {
    try {
      setLoadingOrderId(orderId);

      // prevent polling glitch
      setHiddenOrders((prev) => [
        ...prev,
        orderId,
      ]);

      // optimistic remove
      setOrders((prev: any[]) =>
        prev.filter(
          (order) => order.id !== orderId
        )
      );

      await axios.post(
        "https://servora-sable.vercel.app/api/orders/pay",
        {
          orderId,
          amount,
          tenantId: user.tenantId,
        }
      );
    } catch (err) {
      console.log(err);

      setHiddenOrders((prev) =>
        prev.filter((id) => id !== orderId)
      );

      fetchOrders();
    } finally {
      setLoadingOrderId(null);
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
      <View style={styles.pageHeader}>
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

            <View style={styles.actions}>
              {order.status === "PENDING" && (
                <>
                  <TouchableOpacity
                    disabled={
                      loadingOrderId === order.id
                    }
                    style={[
                      styles.acceptButton,
                      loadingOrderId === order.id && {
                        opacity: 0.6,
                      },
                    ]}
                    onPress={() =>
                      updateOrder(
                        order.id,
                        "CONFIRMED"
                      )
                    }
                  >
                    <Text style={styles.buttonText}>
                      {loadingOrderId === order.id
                        ? "Loading..."
                        : "Accept"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={
                      loadingOrderId === order.id
                    }
                    style={[
                      styles.rejectButton,
                      loadingOrderId === order.id && {
                        opacity: 0.6,
                      },
                    ]}
                    onPress={() =>
                      updateOrder(
                        order.id,
                        "CANCELLED"
                      )
                    }
                  >
                    <Text style={styles.buttonText}>
                      {loadingOrderId === order.id
                        ? "Loading..."
                        : "Decline"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {(order.status === "CONFIRMED" ||
                order.status === "READY") && (
                <TouchableOpacity
                  disabled={
                    loadingOrderId === order.id
                  }
                  style={[
                    styles.paidButton,
                    loadingOrderId === order.id && {
                      opacity: 0.6,
                    },
                  ]}
                  onPress={() =>
                    markPaid(
                      order.id,
                      Number(order.total)
                    )
                  }
                >
                  <Text style={styles.buttonText}>
                    {loadingOrderId === order.id
                      ? "Loading..."
                      : "Mark Paid"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
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

  pageHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
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

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    flexWrap: "wrap",
  },

  acceptButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  rejectButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  paidButton: {
    backgroundColor: "#111827",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
  },
});