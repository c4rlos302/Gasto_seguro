import { Image } from 'expo-image';
import { Redirect } from 'expo-router';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import { logout } from '../../src/services/auth.service';
import { useRouter } from 'expo-router';
import { Loader } from '../../components/loader';
import { useState } from 'react';
import { useUser } from '../../src/hooks/useUser';

export default function inicio() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { usuario } = useUser();

  const cerrarSesion = async () => {
    if(loading) return;

    setLoading(true);
    await logout();
    setLoading(false);
    if (Platform.OS === 'web') {
      window.location.href = '/(auth)/login';
    } else {
      router.replace('/(auth)/login');
    }
  }
  return (

    <View style={styles.container}> 
      <View style={styles.header}>
        <Text style={styles.title}>Hola, {usuario?.nombre}</Text>
        <Loader visible={loading} />
      </View>
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
});