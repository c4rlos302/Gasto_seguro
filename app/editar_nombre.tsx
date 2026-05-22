import { router } from "expo-router";
import { CardContainer, CardView } from "@/components/ui/Card";
import Header from "@/components/ui/Header";
import { useUser } from "../src/hooks/useUser";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";
import { Loader } from "@/components/loader";

export default function EditarNombre() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  const { usuario, editNombre } = useUser();
  const [nombre, setNombre] = useState("");

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (usuario?.nombre) {
      setNombre(usuario.nombre);
    }
  }, [usuario]);

  async function guardarCambios() {
    if (!usuario?.id) return;
    else if (usuario.nombre === nombre) {
      Alert.alert("Error", "No puedes asignar el mismo nombre");
      return;
    } else if (nombre.length === 0) {
      Alert.alert("Error", "El nombre no puede estar vacío");
      return;
    }

    setLoading(true);
    await editNombre(nombre);
    setLoading(false);

    Alert.alert("Exito!", "Nombre actualizado");
    router.push("/perfil");
  }


  return (
    <CardContainer>
      <Header
        title="Editar nombre"
        regresar
      />
      <CardView>
        <Text style={[styles.label, { color: colors.text }]}>Nuevo nombre:</Text>
        <TextInput
          placeholder="Ingresa el nombre completo"
          placeholderTextColor={colors.text}
          value={nombre}
          onChangeText={setNombre}
          style={[styles.input, { backgroundColor: colors.fondo, color: colors.text }]}
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.principal }, loading && styles.buttonDisabled]}
          onPress={guardarCambios}
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