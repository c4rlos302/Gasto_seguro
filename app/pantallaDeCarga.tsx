import { darkColors, lightColors } from "@/constants/theme";
import { useTheme } from "@/src/context/ThemeContext";
import { View, ActivityIndicator, StyleSheet, Image, Text } from "react-native";

export default function PantallaDeCarga({ visible }: { visible: boolean }) {
  if (!visible) return null;
  const { isDark, setTheme } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  return (
    <View style={[styles.overlay, { backgroundColor: colors.fondo}]}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />

      <Text style={[styles.title, {color: colors.text}]}>
        Gasto Seguro
      </Text>

      <Text style={[styles.subtitle, {color: colors.text}]}>
        Controla tu dinero inteligentemente
      </Text>

      <ActivityIndicator
        size="large"
        color={colors.link}
        style={styles.loader}
      />
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
    paddingHorizontal: 20,
  },

  logo: {
    width: 220,
    height: 220,
    resizeMode: "contain",
    borderRadius: 100,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginTop: 15,
  },

  subtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },

  loader: {
    marginTop: 30,
  },
});