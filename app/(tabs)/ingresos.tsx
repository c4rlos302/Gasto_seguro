import { useState } from 'react'
import { Text, View, Pressable, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native'
import { Loader } from '../../components/loader'
import Header from '../../components/ui/Header'
import { CardContainer, CardView } from '../../components/ui/Card'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useCategorias } from '../../src/hooks/useCategorias'
import { useMovimientos } from '../../src/hooks/useMovimientos'
import DateTimePicker from '@react-native-community/datetimepicker'

export default function addIngresos() {
  const { categorias } = useCategorias("ingreso");
  const { addMovimiento } = useMovimientos();

  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [fecha, setFecha] = useState<Date | null>(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const guardarIngreso = async () => {
    if (!monto) {
      Alert.alert("Error", "Escribe un monto para el ingreso");
      return;
    } else if (!fecha) {
      Alert.alert("Error", "Selecciona una fecha");
      return;
    }
    else if (!categoriaId) {
      Alert.alert("Error", "Selecciona una categoría");
      return;
    } else if (parseFloat(monto) <= 0 || isNaN(parseFloat(monto))) {
      Alert.alert("Error", "Monto debe ser un número válido");
      return;
    }

    setLoading(true);

    await addMovimiento({
      monto: parseFloat(monto),
      descripcion: descripcion || "",
      categoria_id: categoriaId,
      tipo: "ingreso",
      fecha: fecha ? fecha.toISOString() : new Date().toISOString(),
    });

    setLoading(false);

    setMonto("");
    setFecha(null);
    setCategoriaId("");
    setDescripcion("");
    Alert.alert("Éxito", "Ingreso registrado");
    router.back();
  }
  return (
    <CardContainer>
      <Header title="Agregar ingreso"
        up={
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
        } />
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
                  style={styles.text}>
                  {cat.nombre}
                </Text>
              </Pressable>
            ))}
            <TouchableOpacity
              style={styles.categoria}
              onPress={() => { setCategoriaId(""); Alert.alert("Crear categoria", "Ir a crear categoria") }}>
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
          onPress={guardarIngreso}
        >
          <Text style={styles.buttonText}>
            {loading ? "Guardando..." : "Guardar Ingreso"}
          </Text>
        </TouchableOpacity>
      </CardView>
      <Loader visible={loading} />
    </CardContainer>
  )
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
    color: "#000"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});