import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/ui/Header";
import { CardContainer, CardView } from "@/components/ui/Card";
import { useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";
import { Colors } from "@/constants/colors";


export default function Apariencia() {
  const { isDark, setTheme } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  return (
    <CardContainer>
      <Header title="Preferencias" regresar />

      <Text style={[styles.title, { color: colors.text }]}>Selecciona el tema</Text>

      <CardView>
        <TouchableOpacity
          style={[styles.option, { backgroundColor: colors.secundario }]}
          onPress={() => setTheme("light")}
        >
          <Ionicons name="sunny-outline" size={22} color={Colors.principalLight} />
          <Text style={[styles.optionText, { color: colors.text }]}>Claro</Text>
        </TouchableOpacity>
      </CardView>

      <CardView>
        <TouchableOpacity
          style={[styles.option, { backgroundColor: colors.secundario }]}
          onPress={() => setTheme("dark")}>
          <Ionicons name="moon-outline" size={22} color={Colors.principalLight} />
          <Text style={[styles.optionText, { color: colors.text }]}>Oscuro</Text>
        </TouchableOpacity>
      </CardView>

      <CardView>
        <TouchableOpacity
          style={[styles.option, { backgroundColor: colors.secundario }]}
          onPress={() => setTheme("auto")}>
          <Ionicons name="phone-portrait-outline" size={22} color={Colors.principalLight} />
          <Text style={[styles.optionText, { color: colors.text }]}>Automático</Text>
        </TouchableOpacity>
      </CardView>

      <Text style={[styles.title, { color: colors.text }]}>Mostrar notificaciones</Text>
    </CardContainer>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 15,
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