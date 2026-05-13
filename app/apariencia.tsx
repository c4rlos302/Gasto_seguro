import { useTheme } from "@/src/context/ThemeContext";
import { lightColors, darkColors } from "@/src/context/ThemeContext";
import { CardContainer, CardView } from "@/components/ui/Card";
import Header from "@/components/ui/Header";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, useColorScheme } from "react-native";


export default function Apariencia() {
  const { isDark, setTheme } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  return (
    <CardContainer style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header title="Apariencia" regresar={true} />

      <Text style={[styles.title, { color: colors.text }]}>Selecciona el tema</Text>

      <CardView>
        <TouchableOpacity style={styles.option} onPress={() => setTheme("light")}>
          <Ionicons name="sunny-outline" size={22} color={colors.text} />
          <Text style={[styles.optionText, { color: colors.text }]}>Claro</Text>
        </TouchableOpacity>
      </CardView>

      <CardView>
        <TouchableOpacity style={styles.option} onPress={() => setTheme("dark")}>
          <Ionicons name="moon-outline" size={22} color={colors.text} />
          <Text style={[styles.optionText, { color: colors.text }]}>Oscuro</Text>
        </TouchableOpacity>
      </CardView>

      <CardView>
        <TouchableOpacity style={styles.option} onPress={() => setTheme("auto")}>
          <Ionicons name="phone-portrait-outline" size={22} color={colors.text} />
          <Text style={[styles.optionText, { color: colors.text }]}>Automático</Text>
        </TouchableOpacity>
      </CardView>
    </CardContainer>
  );
}
const styles = StyleSheet.create({
  header: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#AACDDC",
    paddingHorizontal: 20,
    paddingTop: 30,
    borderRadius: 8,
    marginBottom: 20,
  },
   title: {
    color: "#213448",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 1,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "600",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "500",
  }
});