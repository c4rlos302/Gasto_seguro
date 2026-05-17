import { useState } from "react";
import { router } from "expo-router";
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { Loader } from "@/components/loader";
import Header from "@/components/ui/Header";
import { CardContainer, CardView } from "@/components/ui/Card";
import { supabase } from "@/src/services/supabase";
import { useUser } from "../src/hooks/useUser";
import { useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";

export default function CambiarCorreo() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const { usuario } = useUser();

  const [email, setEmail] = useState(
    usuario?.correo || ""
  );

  const [loading, setLoading] = useState(false);

  async function guardarCorreo() {

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      email: email
    });

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    await supabase
      .from("usuarios")
      .update({
        correo: email
      })
      .eq("id", usuario.id);

    setLoading(false);

    alert("Correo actualizado");

    router.back();
  }

  return (
    <CardContainer>
      <Header
        title="Editar correo"
        regresar
      />
      <CardView>
        <Text style={[styles.title, { color: colors.text }]}>Ingresa el correo nuevo</Text>
        <TextInput
          placeholder="Correo electronico"
          placeholderTextColor={colors.text}
          value={email}
          onChangeText={setEmail}
          style={[styles.input, { backgroundColor: colors.fondo }]}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.principal }, loading && styles.buttonDisabled]}
          onPress={guardarCorreo}
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 1,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    padding: 14,
    borderRadius: 10,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  }
});