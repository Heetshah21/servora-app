import { Drawer } from "expo-router/drawer";
import { Redirect } from "expo-router";
import { useAuth } from "../../context/AuthContext";
export default function DrawerLayout() {
  const { user, loading } = useAuth();

if (loading) {
  return null;
}

if (!user) {
  return <Redirect href="/login" />;
}
  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: "#111827",
        },

        headerTintColor: "white",

        drawerActiveTintColor: "#111827",
      }}
    >
      <Drawer.Screen
        name="dashboard"
        options={{
          headerTitle: "",
        }}
      />

      <Drawer.Screen
        name="analytics"
        options={{
          title: "Analytics",
        }}
      />
      
      <Drawer.Screen
          name="orders"
          options={{
            headerTitle: "",
          }}
        />

      <Drawer.Screen
        name="kitchen"
        options={{
          headerTitle: "",
        }}
      />

      <Drawer.Screen
        name="qr"
        options={{
          title: "QR Generator",
        }}
      />

      <Drawer.Screen
        name="settings"
        options={{
          headerTitle: "",
        }}
      />
    </Drawer>
  );
}