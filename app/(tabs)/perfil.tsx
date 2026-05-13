import { Loader } from "@/components/loader";
import { CardContainer, CardView } from "@/components/ui/Card";
import Header from "@/components/ui/Header";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from "../../src/services/supabase";
import { useUser } from '../../src/hooks/useUser';
import { logout } from '../../src/services/auth.service';


export default function PerfilScreen() {
  const { usuario } = useUser();
  const [loading, setLoading] = useState(false);

  const [avatar, setAvatar] = useState(usuario?.avatar_url || null);

async function pickImage() {

  if (!usuario?.id) return;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (result.canceled) return;

  try {

    const image = result.assets[0];

    const response = await fetch(image.uri);
    const blob = await response.blob();

    const fileName = `${usuario.id}-${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, blob, {
        contentType: "image/jpeg",
      });

    if (uploadError) {
      console.log(uploadError);
      return;
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const publicUrl = data.publicUrl;

    await supabase
      .from("usuarios")
      .update({
        avatar_url: publicUrl
      })
      .eq("id", usuario.id);

    setAvatar(publicUrl);

  } catch (error) {
    console.log(error);
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
          <TouchableOpacity style={styles.option} onPress={() => router.push("/editar_perfil")}>
            <Ionicons name="person-outline" size={20} color="#81A6C6" />
            <Text style={styles.optionText}>Editar datos</Text>
            <Ionicons name="chevron-forward" size={20} color="#81A6C6" />
          </TouchableOpacity>
        </CardView>

        <CardView>
          <TouchableOpacity style={styles.option} onPress={() => router.push("/configuracion")}>
            <Ionicons name="settings-outline" size={20} color="#81A6C6" />
            <Text style={styles.optionText}>Configuración</Text>
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
    backgroundColor: "#213448",
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