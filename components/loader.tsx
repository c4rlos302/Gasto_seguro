import { darkColors, lightColors } from "@/constants/theme";
import { useTheme } from "@/src/context/ThemeContext";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export function Loader({ visible }: { visible: boolean }) {
  if (!visible) return null;
  const { isDark, setTheme } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  return (
    <View style={[styles.overlay, {backgroundColor: colors.overlay}]}>
      <ActivityIndicator size="large" color={colors.principal} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});