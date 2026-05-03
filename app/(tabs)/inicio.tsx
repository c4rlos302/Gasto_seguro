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
    <View>
      <Text>Hola, {usuario?.nombre}</Text>
      <Button title="Cerrar sesión" onPress={cerrarSesion} />
      <Loader visible={loading} />
    </View>
  );
}