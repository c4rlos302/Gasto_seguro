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
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddGastoScreen() {
  const { categorias } = useCategorias();
  const { addMovimiento } = useMovimientos();

  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [fecha, setFecha] = useState<Date | null>(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!monto) {
      Alert.alert("Error", "Escribe un monto para el gasto");
      return;
    }else if (!fecha) {
      Alert.alert("Error", "Selecciona una fecha");
      return;
    }else if (!categoriaId) {
      Alert.alert("Error", "Selecciona una categoría");
      return;
    }
    else if (parseFloat(monto) <= 0 || isNaN(parseFloat(monto))) {
      Alert.alert("Error", "Monto debe ser un número válido");
      return;
    }

    setLoading(true);

    await addMovimiento({
      monto: parseFloat(monto),
      descripcion: descripcion || "",
      categoria_id: categoriaId,
      tipo: "gasto",
      fecha: fecha ? fecha.toISOString() : new Date().toISOString(),
    });

    setLoading(false);

    setMonto("");
    setFecha(null);
    setCategoriaId("");
    setDescripcion("");
    Alert.alert("Éxito", "Gasto registrado");
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#dc2626" }}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Agregar gasto</Text>
      </View>

      {/* CARD */}
      <View style={styles.card}>

        <Text style={styles.label}>Monto</Text>
        <TextInput
          placeholder="Monto"
          keyboardType="numeric"
          value={monto}
          onChangeText={setMonto}
          style={styles.input}
        />

        <Text style={styles.label}>Fecha</Text>
        <Pressable style={styles.input} onPress={() => setShow(true)} >
          <Text>{fecha ? fecha.toLocaleDateString() : "Seleccionar fecha"}</Text>
        </Pressable>

        {show && (
          <DateTimePicker
            value={ fecha || new Date() }
            mode="date"
            display="default"
            onChange={(_, f) => {
              setShow(false);
              f && setFecha(f);
            }}
          />
        )}

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
              <Text
                style={{
                  color: categoriaId === cat.id ? "#fff" : "#000",
                }}
              >
                {cat.nombre}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChangeText={setDescripcion}
          style={styles.input}
        />

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
  header: {
    height: 140,
    padding: 20,
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 25,
  },

  card: {
    flex: 1,
    backgroundColor: "#f8fafc",
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
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
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});