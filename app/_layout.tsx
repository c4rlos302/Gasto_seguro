import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { ThemeProvider, useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";
import { useEffect, useState } from 'react';
import { requestPermissionsAsync, setNotificationHandler } from "expo-notifications";

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function RootStack() {
  const { isDark } = useTheme();
  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: lightColors.fondo,
      card: lightColors.secundario,
      text: lightColors.text,
      primary: lightColors.principal,
      border: "transparent",
      notification: lightColors.principal,
    },
  };

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: darkColors.fondo,
      card: darkColors.secundario,
      text: darkColors.text,
      primary: darkColors.principal,
      border: "transparent",
      notification: darkColors.principal,
    },
  };

  return (
    <NavigationThemeProvider value={isDark ? MyDarkTheme : MyLightTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {

  useEffect(() => {
    requestPermissionsAsync();
  }, []);

  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );

}
