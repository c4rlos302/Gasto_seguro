import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import { Loader } from "../../components/loader";
import Card from "../../components/ui/Card";
import Header from "../../components/ui/Header";
import { useCategorias } from "../../src/hooks/useCategorias";
import { useMovimientos } from "../../src/hooks/useMovimientos";

export default function AddGastoScreen() {
  const { categorias } = useCategorias("gasto");
  const { addMovimiento } = useMovimientos();

  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [fecha, setFecha] = useState<Date | null>(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const guardarGasto = async () => {
    if (!monto) {
      Alert.alert("Error", "Escribe un monto para el gasto");
      return;
    } else if (!fecha) {
      Alert.alert("Error", "Selecciona una fecha");
      return;
    } else if (!categoriaId) {
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
    <View style={{ flex: 1 }}>

      <Header
        title="Agregar gasto"
        up={
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
        } />

      <Card>
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
            value={fecha || new Date()}
            mode="date"
            display="default"
            onChange={(_, f) => {
              setShow(false);
              f && setFecha(f);
            }}
          />
        )}

        <Text style={styles.label}>Categoría</Text>

        <ScrollView style={{maxHeight: 125}}>
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
          <Pressable 
            style={{...styles.categoria, backgroundColor: "#dc2626"}}
            onPress={() => {setCategoriaId(""); Alert.alert("Crear categoria", "Ir a crear categoria")}}>
            <Text style={{color: "#fff"}}>Otra</Text>
          </Pressable>
        </View>
        </ScrollView>

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChangeText={setDescripcion}
          style={styles.input}
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={guardarGasto}
        >
          <Text style={styles.buttonText}>
            {loading ? "Guardando..." : "Guardar gasto"}
          </Text>
        </Pressable>

      </Card>
      <Loader visible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
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