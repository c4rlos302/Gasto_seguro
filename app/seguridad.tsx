import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Loader } from "@/components/loader";
import Header from "@/components/ui/Header";
import { CardContainer, CardView } from "@/components/ui/Card";
import { useTheme } from '@/src/context/ThemeContext';
import { darkColors, lightColors } from '@/constants/theme';

export default function Seguridad() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  return (
    <CardContainer>
      <Header
        title="Seguridad"
        regresar
      />
      <CardView>
        <TouchableOpacity style={styles.option} onPress={() => router.push("/cambiar_contrasena")}>
          <Ionicons name="lock-closed-outline" size={20} color="#81A6C6" />
          <Text style={styles.optionText}>Cambiar contraseña</Text>
          <Ionicons name="chevron-forward" size={20} color="#81A6C6" />
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