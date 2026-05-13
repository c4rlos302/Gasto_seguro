import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

export const lightColors = {
  background: "#ffffff",
  text: "#000000",
  card: "#f5f5f5",
};

export const darkColors = {
  background: "#0A1A2F",
  text: "#ffffff",
  card: "#1e1e1e",
};

type Theme = "light" | "dark" | "auto";

type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>("auto");

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const saved = await AsyncStorage.getItem("theme");
    if (saved) setThemeState(saved as Theme);
  };

  const setTheme = async (value: Theme) => {
    setThemeState(value);
    await AsyncStorage.setItem("theme", value);
  };

  const isDark =
    theme === "dark" || (theme === "auto" && systemTheme === "dark");

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}