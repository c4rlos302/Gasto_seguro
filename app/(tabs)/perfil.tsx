import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../src/hooks/useUser';
import { logout } from '../../src/services/auth.service';
import { Loader } from "@/components/loader";
import { StyleSheet } from 'react-native';
import { CardContainer, CardView } from "@/components/ui/Card";
import Header from "@/components/ui/Header";


export default function PerfilScreen() {
  const { usuario } = useUser();
  const [loading, setLoading] = useState(false);

  const [avatar, setAvatar] = useState(usuario?.avatar_url || null);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  }
  const cerrarSesion = async () => {
    if (loading) return;

    setLoading(true);
    await logout();
    setLoading(false);
    router.replace('/(auth)/login');
  }

  return (
    <CardContainer>
      <Header title="Mi perfil" />
      <View style={{padding: 10}}>
        <CardView>
          <View style={styles.avatarContainer}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <Ionicons name="person-circle-outline" size={100} color="#9ca3af" />
            )}
            <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
              <Ionicons name="camera-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nombre: {usuario?.nombre}</Text>
          <Text style={styles.label}>Email: {usuario?.correo}</Text>
        </CardView>

        <CardView>
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("EditarDatos")}>
            <Ionicons name="person-outline" size={20} color="#81A6C6" />
            <Text style={styles.optionText}>Editar datos personales</Text>
            <Ionicons name="chevron-forward" size={20} color="#81A6C6" />
          </TouchableOpacity>
        </CardView>

        <CardView>
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("CambiarPassword")}>
            <Ionicons name="lock-closed-outline" size={20} color="#81A6C6" />
            <Text style={styles.optionText}>Cambiar contraseña</Text>
            <Ionicons name="chevron-forward" size={20} color="#81A6C6" />
          </TouchableOpacity>
        </CardView>

        <CardView>
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Configuracion")}>
            <Ionicons name="settings-outline" size={20} color="#81A6C6" />
            <Text style={styles.optionText}>Configurar preferencias</Text>
            <Ionicons name="chevron-forward" size={20} color="#81A6C6" />
          </TouchableOpacity>
        </CardView>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={cerrarSesion}
        >
          <Text style={styles.buttonText}>
            {loading ? "Cerrando..." : "Cerrar sesión"}
          </Text>
        </TouchableOpacity>

        <Loader visible={loading} />
      </View>
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
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    bottom: 40,
    right: -25,
    backgroundColor: "#AACDDC",
    borderRadius: 20,
    padding: 5,
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
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});