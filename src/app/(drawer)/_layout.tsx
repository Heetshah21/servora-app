import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
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
        name="settings"
        options={{
          headerTitle: "",
        }}
      />
    </Drawer>
  );
}