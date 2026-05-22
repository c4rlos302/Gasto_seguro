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
import { useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";
import { Colors } from "@/constants/colors";


export default function PerfilScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

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
      <View style={{ padding: 10 }}>
        <CardView>
          <View style={styles.avatarContainer}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <Ionicons name="person-circle-outline" size={100} color={colors.chip} />
            )}
            <TouchableOpacity style={[styles.cameraIcon, { backgroundColor: colors.principal }]} onPress={pickImage}>
              <Ionicons name="camera-outline" size={22} color={Colors.blanco} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Nombre: {usuario?.nombre}</Text>
          <Text style={[styles.label, { color: colors.text }]}>Email: {usuario?.correo}</Text>
        </CardView>

        <CardView>
          <TouchableOpacity style={styles.option} onPress={() => router.push("/editar_nombre")}>
            <Ionicons name="person" size={20} color={Colors.principalLight} />
            <Text style={[styles.optionText, { color: colors.text }]}>Editar nombre</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.principalLight} />
          </TouchableOpacity>
        </CardView>

        <CardView>
          <TouchableOpacity style={styles.option} onPress={() => router.push("/cambiar_contrasena")}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.principalLight} />
            <Text style={[styles.optionText, { color: colors.text }]}>Cambiar contraseña</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.principalLight} />
          </TouchableOpacity>
        </CardView>

        <CardView>
          <TouchableOpacity style={styles.option} onPress={() => router.push("/preferencias")}>
            <Ionicons name="options-outline" size={20} color={Colors.principalLight} />
            <Text style={[styles.optionText, { color: colors.text }]}>Preferencias</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.principalLight} />
          </TouchableOpacity>
        </CardView>

        <View style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
          <TouchableOpacity
            style={
              [styles.button,
              { backgroundColor: colors.principal }, loading && styles.buttonDisabled]
            }
            onPress={cerrarSesion}
          >
            <Text style={[styles.buttonText, { color: Colors.blanco }]}>
              {loading ? "Cerrando..." : "Cerrar sesión"}
            </Text>
          </TouchableOpacity>
        </View>

        <Loader visible={loading} />
      </View>
    </CardContainer>
  );

}

const styles = StyleSheet.create({
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
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: Colors.blanco,
  },
  button: {
    width: "94%",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: "600",
  },
});