import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Loader } from "@/components/loader";
import Header from "@/components/ui/Header";
import { CardContainer, CardView } from "@/components/ui/Card";
import { useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";
import { Colors } from "@/constants/colors";

export default function Preferencias() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  return (
    <CardContainer>
      <Header
        title="Preferencias"
        regresar
      />
      <CardView>
        <TouchableOpacity style={styles.option} onPress={() => router.push("/notificaciones")}>
          <Text style={[styles.optionText, { color: colors.text }]}>Notificaciones</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.principalLight} />
        </TouchableOpacity>
      </CardView>

      <CardView>
        <TouchableOpacity style={styles.option} onPress={() => router.push("/apariencia")}>
          <Text style={[styles.optionText, { color: colors.text }]}>Apariencia</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.principalLight} />
        </TouchableOpacity>
      </CardView>
    </CardContainer>
  );
}
const styles = StyleSheet.create({
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