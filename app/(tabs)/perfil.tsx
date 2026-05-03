import { Button } from 'react-native';
import { logout } from '../../src/services/auth.service';
import { router } from 'expo-router';

export default function PerfilScreen() {
  return (
    <Button
      title="Cerrar sesión"
      onPress={async () => {
        await logout();
        router.replace('/(auth)/login');
      }}
    />
  );
}