import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { useCategorias } from "../../src/hooks/useCategorias";
import { useMovimientos } from "../../src/hooks/useMovimientos";
import { router } from "expo-router";

export default function AddGastoScreen() {
  const { categorias } = useCategorias();
  const { addMovimiento } = useMovimientos();

  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!monto || !categoriaId) {
      Alert.alert("Error", "Monto y categoría son obligatorios");
      return;
    }else if (parseFloat(monto) <= 0 || isNaN(parseFloat(monto))) {
      Alert.alert("Error", "Monto debe ser un número válido");
      return;
    }

    setLoading(true);

    await addMovimiento({
      monto: parseFloat(monto),
      descripcion,
      categoria_id: categoriaId,
      tipo: "gasto",
      fecha: new Date(),
    });

    setLoading(false);

    setMonto("");
    setDescripcion("");
    setCategoriaId("");

    Alert.alert("Éxito", "Gasto registrado");
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar gasto </Text>

      <TextInput
        placeholder="Monto"
        keyboardType="numeric"
        value={monto}
        onChangeText={setMonto}
        style={styles.input}
      />

      <TextInput
        placeholder="Descripción (opcional)"
        value={descripcion}
        onChangeText={setDescripcion}
        style={styles.input}
      />

      <Text style={styles.label}>Categoría</Text>

      <View style={styles.categorias}>
        {categorias.map((cat: any) => (
          <Pressable
            key={cat.id}
            style={[
              styles.categoria,
              categoriaId === cat.id && styles.categoriaActiva,
            ]}
            onPress={() => setCategoriaId(cat.id)}
          >
            <Text>{cat.nombre}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>
          {loading ? "Guardando..." : "Guardar gasto"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "600",
  },
  categorias: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  categoria: {
    padding: 10,
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
  },
  categoriaActiva: {
    backgroundColor: "#2563eb",
  },
  button: {
    backgroundColor: "#dc2626",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});