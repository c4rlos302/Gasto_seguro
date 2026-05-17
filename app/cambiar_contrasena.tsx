import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import { router } from "expo-router";
import { Loader } from "@/components/loader";
import Header from "@/components/ui/Header";
import { CardContainer, CardView } from "@/components/ui/Card";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/src/services/supabase";
import { useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";


export default function CambiarContrasena() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Llena todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert("Éxito", "Contraseña actualizada");

    router.back();
  };

  return (

    <CardContainer>
      <Header
        title="Cambiar contraseña"
        regresar
      />

      <CardView>
        <Text style={[styles.title, { color: colors.text }]}>Nueva contraseña:</Text>
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor={colors.text}
          value={password}
          onChangeText={setPassword}
          style={[styles.input, { backgroundColor: colors.fondo }]}
        />
        <TextInput
          placeholder="Confirmar contraseña"
          placeholderTextColor={colors.text}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={[styles.input, { backgroundColor: colors.fondo }]}
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.principal }, loading && styles.buttonDisabled]}
          onPress={handleChangePassword}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Text>
        </TouchableOpacity>
      </CardView>
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: "600",
  }
});