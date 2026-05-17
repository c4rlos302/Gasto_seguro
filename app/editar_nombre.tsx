import { router } from "expo-router";
import { CardContainer, CardView } from "@/components/ui/Card";
import Header from "@/components/ui/Header";
import { supabase } from "@/src/services/supabase";
import { useUser } from "../src/hooks/useUser";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";

export default function EditarNombre() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  const { usuario } = useUser();

  const [nombre, setNombre] = useState(
    usuario?.nombre || ""
  );

  const [loading, setLoading] = useState(false);

  async function guardarCambios() {

    if (!usuario?.id) return;

    setLoading(true);

    const { error } = await supabase
      .from("usuarios")
      .update({
        nombre: nombre
      })
      .eq("id", usuario.id);

    setLoading(false);

    if (error) {
      console.log(error);
      return;
    }

    alert("Nombre actualizado");
    router.back();
  }


  return (
    <CardContainer>
      <Header
        title="Editar nombre"
        regresar
      />
      <CardView>
        <Text style={[styles.title, { color: colors.text }]}>Ingresa el nombre nuevo</Text>
        <TextInput
          placeholder="Nombre completo"
          placeholderTextColor={colors.text}
          value={nombre}
          onChangeText={setNombre}
          style={[styles.input, {backgroundColor: colors.fondo}]}
        />
        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.principal}, loading && styles.buttonDisabled]}
          onPress={guardarCambios}
        >
          <Text style={[styles.buttonText, {color: colors.text}]}>
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