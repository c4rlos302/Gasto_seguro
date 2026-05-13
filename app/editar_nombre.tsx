import { router } from "expo-router";
import { Loader } from "@/components/loader";
import { CardContainer, CardView } from "@/components/ui/Card";
import Header from "@/components/ui/Header";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/src/services/supabase";
import { useUser } from "../src/hooks/useUser";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditarNombre() {

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
        regresar={true}
      />

        <CardView> 
        
            <Text style={styles.title}>Ingresa el nombre nuevo</Text>
              <TextInput
                placeholder="Nombre completo"
                value={nombre}
                onChangeText={setNombre}
                style={styles.input}
              />
      
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={guardarCambios}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Guardando..." : "Guardar cambios"}
                </Text>
              </TouchableOpacity>
        </CardView>
       
    
    </CardContainer>
  );
}

const styles = StyleSheet.create({
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
  title: {
    color: "#213448",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 1,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "600",
  },
  form: {
    gap: 12,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "500",
  },
  button: {
    backgroundColor: '#547792',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  }
});