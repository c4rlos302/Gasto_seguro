import { View, StyleSheet } from "react-native";
import { useTheme } from "@/src/context/ThemeContext";
import { lightColors, darkColors } from "@/constants/theme"; 

// Contenedor principal (pantallas enteras)
export function CardContainer({ children, style }: any) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  return (
    <View style={[styles.cardContainer, { backgroundColor: colors.background }, style]}>
      {children}
    </View>
  );
}

// Vista de tarjeta (bloques dentro de pantallas)
export function CardView({ children, style }: any) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  return (
    <View style={[styles.cardView, { backgroundColor: colors.card }, style]}>
      {children}
    </View>
  );
}

// Tarjeta simple reutilizable
export default function Card({ children, style }: any) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  return (
    <View style={[styles.card, { backgroundColor: colors.card }, style]}>
      {children}
    </View>
  );
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
    width: "auto",
  },
  card: {
    borderRadius: 8,
    padding: 10,
  },
});
