import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/ui/Header";
import { CardContainer, CardView } from "@/components/ui/Card";
import { useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";
import { Colors } from "@/constants/colors";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Apariencia() {
  const { isDark, setTheme } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  const [notificacionesActivas, setNotificacionesActivas] =
    useState(true);

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  async function cargarNotificaciones() {
    const valor = await AsyncStorage.getItem(
      "notificacionesActivas"
    );

    if (valor !== null) {
      setNotificacionesActivas(JSON.parse(valor));
    }
  }

  // Guardar al cambiar switch
  async function cambiarNotificaciones(valor: boolean) {
    setNotificacionesActivas(valor);

    await AsyncStorage.setItem(
      "notificacionesActivas",
      JSON.stringify(valor)
    );
  }

  return (
    <CardContainer>
      <Header title="Preferencias" regresar />

      <Text style={[styles.title, { color: colors.text }]}>
        Selecciona el tema
      </Text>

      <CardView>
        <TouchableOpacity
          style={[
            styles.option,
            { backgroundColor: colors.secundario },
          ]}
          onPress={() => setTheme("light")}
        >
          <Ionicons
            name="sunny-outline"
            size={22}
            color={Colors.principalLight}
          />
          <Text
            style={[
              styles.optionText,
              { color: colors.text },
            ]}
          >
            Claro
          </Text>
        </TouchableOpacity>
      </CardView>

      <CardView>
        <TouchableOpacity
          style={[
            styles.option,
            { backgroundColor: colors.secundario },
          ]}
          onPress={() => setTheme("dark")}
        >
          <Ionicons
            name="moon-outline"
            size={22}
            color={Colors.principalLight}
          />
          <Text
            style={[
              styles.optionText,
              { color: colors.text },
            ]}
          >
            Oscuro
          </Text>
        </TouchableOpacity>
      </CardView>

      <CardView>
        <TouchableOpacity
          style={[
            styles.option,
            { backgroundColor: colors.secundario },
          ]}
          onPress={() => setTheme("auto")}
        >
          <Ionicons
            name="phone-portrait-outline"
            size={22}
            color={Colors.principalLight}
          />
          <Text
            style={[
              styles.optionText,
              { color: colors.text },
            ]}
          >
            Automático
          </Text>
        </TouchableOpacity>
      </CardView>

      <Text style={[styles.title, { color: colors.text }]}>
        Mostrar notificaciones
      </Text>

      <CardView>
        <View style={styles.option}>
          <Text
            style={[
              styles.optionText,
              { color: colors.text },
            ]}
          >
            Activar notificaciones
          </Text>

          <Switch
            value={notificacionesActivas}
            onValueChange={cambiarNotificaciones}
          />
        </View>
      </CardView>
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
  },
});