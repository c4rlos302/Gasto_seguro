import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { useState } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../src/hooks/useUser';
import { logout } from '../../src/services/auth.service';
import { StyleSheet } from 'react-native';


export default function PerfilScreen() {
  const { usuario } = useUser();
  const [email, getEmail] = useState('');

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

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Mi perfil</Text></View>

        <View style={styles.containerView}>
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
        </View>
        
      <View style={styles.containerView}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("EditarDatos")}>
          <Ionicons name="person-outline" size={20} color="#81A6C6" />
          <Text style={styles.optionText}>Editar datos personales</Text>
          <Ionicons name="chevron-forward" size={20} color="#81A6C6" />
        </TouchableOpacity>
      </View>

      <View style={styles.containerView}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("CambiarPassword")}>
          <Ionicons name="lock-closed-outline" size={20} color="#81A6C6" />
          <Text style={styles.optionText}>Cambiar contraseña</Text>
          <Ionicons name="chevron-forward" size={20} color="#81A6C6" />
        </TouchableOpacity>
      </View>

      <View style={styles.containerView}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Configuracion")}>
          <Ionicons name="settings-outline" size={20} color="#81A6C6" />
          <Text style={styles.optionText}>Configurar preferencias</Text>
          <Ionicons name="chevron-forward" size={20} color="#81A6C6" />
        </TouchableOpacity>
      </View>

      <Button 
        title="Cerrar sesión"
        onPress={async () => {
          await logout();
          router.replace('/(auth)/login');
        }}
      />
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
  backgroundColor: "#2563eb",
  borderRadius: 20,
  padding: 5,
},
});