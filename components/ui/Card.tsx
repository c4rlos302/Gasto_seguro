import { View, StyleSheet } from "react-native";
import { useTheme } from "@/src/context/ThemeContext";
import { lightColors, darkColors } from "@/constants/theme";

export function CardContainer({ children }: any) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  return <View style={[styles.cardContainer, {backgroundColor: colors.fondo}]}>{children}</View>;
}

export function CardView({ children, style }: any) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  return <View style={[styles.cardView, {backgroundColor: colors.secundario} ,style]}>{children}</View>
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
  },
  cardView: {
    padding: 15,
    marginHorizontal: 10,
    marginTop: 15,
    borderRadius: 20,
    width: "auto"
  }
});