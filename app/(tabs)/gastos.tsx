import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useState, useCallback } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Loader } from "../../components/loader";
import { CardContainer, CardView } from "../../components/ui/Card";
import Header from "../../components/ui/Header";
import { useCategorias } from "../../src/hooks/useCategorias";
import { useMovimientos } from "../../src/hooks/useMovimientos";
import CategoriaModal from "@/components/forms/CategoriaModal";

export default function addGastos() {
  const { categorias, fetchCategorias, addCategoria } = useCategorias("gasto");
  const { addMovimiento } = useMovimientos();

  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState<Date | null>(null);
  const [show, setShow] = useState(false);
  const [categoriaId, setCategoriaId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const cargarDatos = async () => {
        setLoading(true);
        await Promise.all([
          fetchCategorias(),
        ]);
        setLoading(false);
      };

      cargarDatos();
    }, [])
  );

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

  const guardarCategoria = async (
        nombre: string,
        tipo: "gasto" | "ingreso"
    ) => {
      setLoading(true);
      await addCategoria(nombre, tipo);
      setModalVisible(false);
      setLoading(false);
  };

  return (
    <CardContainer>

      <Header
        title="Agregar gasto"
        regresar="true" />

      <CardView>
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

        <ScrollView style={{ maxHeight: 125 }}>
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
                <Text style={styles.text}>
                  {cat.nombre}
                </Text>
              </Pressable>
            ))}
            <TouchableOpacity
              style={styles.categoria}
              onPress={() => {
                setCategoriaId("");
                setModalVisible(true);
              }}>
              <Text style={styles.text}>Otra</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChangeText={setDescripcion}
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={guardarGasto}
        >
          <Text style={styles.buttonText}>
            {loading ? "Guardando..." : "Guardar gasto"}
          </Text>
        </TouchableOpacity>

      </CardView>
      <CategoriaModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        onSave={guardarCategoria}
        modoEdicion={false}
        loading={loading}
        activo={false}
        tipoCategoria="gasto"
      />
      <Loader visible={loading} />
    </CardContainer>
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
    backgroundColor: "#fff",
    borderRadius: 8,
  },

  categoriaActiva: {
    backgroundColor: "#AACDDC",
  },

  button: {
    backgroundColor: "#AACDDC",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  text: {
    color: "#000",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  }
});