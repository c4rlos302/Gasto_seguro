import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { darkColors, lightColors } from "@/constants/theme";
import { useTheme } from "@/src/context/ThemeContext";
import { Colors } from "@/constants/colors";

export default function TabLayout() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const activeColor = Colors.principalLight;
  const inactiveColor = colors.text;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: colors.secundario,
          borderTopWidth: 0,
          elevation: 10,
          height: 90,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="inicio"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="reportes"
        options={{
          title: "Reportes",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="historial"
        options={{
          title: "Historial",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}