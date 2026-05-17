import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

import Header from "@/components/ui/Header";
import { CardContainer, CardView } from "@/components/ui/Card";
import { useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";
import { Colors } from "@/constants/colors";


export default function EditarPerfil() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  return (
    <CardContainer>
      <Header
        title="Editar perfil"
        regresar
      />
      <CardView>
        <TouchableOpacity style={styles.option} onPress={() => router.push("/editar_nombre")}>
          <Text style={[styles.optionText, {color: colors.text}]}>Editar nombre</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.principalLight} />
        </TouchableOpacity>
      </CardView>

      <CardView>
        <TouchableOpacity style={styles.option} onPress={() => router.push("/email")}>
          <Text style={[styles.optionText, {color: colors.text}]}>Email</Text>
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