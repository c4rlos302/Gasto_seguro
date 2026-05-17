import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Loader } from "@/components/loader";
import Header from "@/components/ui/Header";
import { CardContainer, CardView } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";

export default function Configuracion() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  return (
    <CardContainer>
      <Header
        title="Configuración"
        regresar
      />
      <CardView>
        <TouchableOpacity style={styles.option} onPress={() => router.push("/cambiar_contrasena")}>
          <Ionicons name="lock-closed-outline" size={20} color={Colors.principalLight} />
          <Text style={[styles.optionText, {color: colors.text}]}>Cambiar contraseña</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.principalLight} />
        </TouchableOpacity>
      </CardView>

      <CardView>
        <TouchableOpacity style={styles.option} onPress={() => router.push("/preferencias")}>
          <Ionicons name="options-outline" size={20} color={Colors.principalLight} />
          <Text style={[styles.optionText, {color: colors.text}]}>Preferencias</Text>
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