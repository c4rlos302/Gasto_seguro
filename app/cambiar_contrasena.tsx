import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import { router } from "expo-router";
import { Loader } from "@/components/loader";
import Header from "@/components/ui/Header";
import { CardContainer, CardView } from "@/components/ui/Card";
import { useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";
import { checkEmailExists, login, resetPassword, updatePassword } from '@/src/services/auth.service';
import { supabase } from '@/src/services/supabase';
import { isValidEmail } from '@/src/utils/validators';


export default function CambiarContrasena() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const [passwordAnt, setPasswordAnt] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!passwordAnt || !password || !confirmPassword) {
      Alert.alert("Error", "Llena todos los campos");
      return;
    } else if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    } else if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }


    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      setLoading(false);

      Alert.alert(
        "Error",
        "No se pudo obtener el usuario"
      );

      return;
    }

    setLoading(true);

    const { error: loginError } = await login(user.email, passwordAnt);
    if (loginError) {
      setLoading(false);
      Alert.alert("Error", "La contraseña actual es incorrecta");
      return;
    }

    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert("Éxito", "Contraseña actualizada");

    router.back();
  };

  const recuperarPassword = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      setLoading(false);
      Alert.alert('Error', 'No se pudo obtener el correo electronico');
      return;
    }
    
    const { error } = await resetPassword(user.email);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert('Correo enviado', 'Revisa tu bandeja de entrada');
  }

  return (

    <CardContainer>
      <Header
        title="Cambiar contraseña"
        regresar
      />

      <CardView>
        <Text style={[styles.label, { color: colors.text }]}>Contraseña actual:</Text>
        <TextInput
          placeholder="Ingresa la contraseña actual"
          placeholderTextColor={colors.text}
          secureTextEntry
          value={passwordAnt}
          onChangeText={setPasswordAnt}
          style={[styles.input, { backgroundColor: colors.fondo }]}
        />
        <TouchableOpacity onPress={recuperarPassword}>
          <Text style={[styles.linkRecuperar, { color: colors.link }]}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        <Text style={[styles.label, { color: colors.text }]}>Nueva contraseña:</Text>
        <TextInput
          placeholder="Ingresa la nueva contraseña"
          placeholderTextColor={colors.text}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[styles.input, { backgroundColor: colors.fondo }]}
        />

        <Text style={[styles.label, { color: colors.text }]}>Corfirmar nueva contraseña:</Text>
        <TextInput
          placeholder="Confirma la nueva contraseña"
          placeholderTextColor={colors.text}
          secureTextEntry
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
      <Loader visible={loading} />
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "600",

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
  },
  linkRecuperar: {
    fontSize: 12,
    marginTop: -10,
  }
});