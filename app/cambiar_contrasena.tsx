import { router } from "expo-router";
import { Loader } from "@/components/loader";
import { CardContainer, CardView } from "@/components/ui/Card";
import Header from "@/components/ui/Header";
import { Ionicons } from "@expo/vector-icons";
import { useState } from 'react';
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/src/services/supabase";
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';


export default function CambiarContrasena() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
  if (!password || !confirmPassword) {
    Alert.alert("Error", "Llena todos los campos");
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert("Error", "Las contraseñas no coinciden");
    return;
  }

  setLoading(true);

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  setLoading(false);

  if (error) {
    Alert.alert("Error", error.message);
    return;
  }

  Alert.alert("Éxito", "Contraseña actualizada");

  router.back();
};
 
  return (
    
    <CardContainer>
         <Header
        title="Cambiar contraseña"
        regresar={true}
      />

      <CardView>
         <Text style={styles.label}>
          Nueva contraseña
        </Text>

        <TextInput
          secureTextEntry
          placeholder="Nueva contraseña"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>
          Confirmar contraseña
        </Text>

        <TextInput
          secureTextEntry
          placeholder="Confirmar contraseña"
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Guardando..." : "Guardar contraseña"}
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
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "600",
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
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
 button: {
    backgroundColor: "#547792",
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