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
      <View style={styles.header}><Text style={styles.title}>Agregar gasto </Text></View>

      <View style={styles.containerView}><TextInput
        placeholder="Monto $"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
     height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#AACDDC",
    paddingHorizontal: 20,
    paddingTop: 30,
    borderRadius: 8,
    marginBottom: 20, 
  },
  containerView: {
    padding: 15,
    marginHorizontal: 10,  
    marginTop: 15,          
    backgroundColor: "#e9f3ff",
    borderRadius: 20,
    width: "auto",         
  },
  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "#BCCCDC",
    borderRadius: 8,
  },
  categoriaActiva: {
    backgroundColor: "#2563eb",
  },
  button: {
    backgroundColor: "#1d4ed8",
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