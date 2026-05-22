import { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { login, resetPassword, updatePassword, checkEmailExists } from '../../src/services/auth.service';
import { router, useLocalSearchParams } from 'expo-router';
import { Loader } from '../../components/loader';
import { StyleSheet } from 'react-native';
import { darkColors, lightColors } from '@/constants/theme';
import { useTheme } from '@/src/context/ThemeContext';
import { CardContainer } from '@/components/ui/Card';
import { Colors } from '@/constants/colors';
import { isValidEmail } from '@/src/utils/validators';

export default function LoginScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const { email, password } = useLocalSearchParams();
  const [userEmail, setEmail] = useState(email || '');
  const [userPassword, setPassword] = useState(password || '');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    if (!userEmail) {
      Alert.alert('Error', 'Por favor ingresa tu correo');
      return;
    } else if (!userPassword) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña');
      return;
    }

    setLoading(true);

    const { error } = await login(userEmail.toString(), userPassword.toString());

    setLoading(false);

    if (error?.message.includes('Invalid login credentials')) {
      Alert.alert('Error', 'Credenciales inválidas');
      return;
    }
    else if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    router.replace('/(tabs)/inicio');
  };

  const recuperarPassword = async () => {
    setLoading(true);
    const existsResponse = await checkEmailExists(userEmail.toString());
    setLoading(false);
    if (!userEmail) {
      Alert.alert('Error', 'Ingresa tu correo electrónico para recuperar la contraseña');
      return;
    } else if (!isValidEmail(userEmail.toString())) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
      return;
    } else if (!existsResponse.exists) {
      Alert.alert('Error', 'No existe cuenta asociada a ese correo');
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(userEmail.toString());
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert('Correo enviado', 'Revisa tu bandeja de entrada');
  }

  return (
    <CardContainer style={{ position: "relative" }}>
      <View style={[styles.container, { backgroundColor: colors.secundario }]}>

        <Text style={[styles.title, { color: colors.text }]}>Gasto Seguro</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>Inicia sesión para continuar</Text>

        <View style={styles.form}>
          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor={colors.text}
            value={userEmail.toString()}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={
              [styles.input,
              { color: colors.text, backgroundColor: colors.fondo, borderColor: colors.principal }]
            }
          />

          <TextInput
            placeholder="Contraseña"
            placeholderTextColor={colors.text}
            secureTextEntry
            value={userPassword.toString()}
            onChangeText={setPassword}
            style={
              [styles.input,
              { color: colors.text, backgroundColor: colors.fondo, borderColor: colors.principal }]
            }
          />
          <TouchableOpacity onPress={recuperarPassword}>
            <Text style={[styles.linkRecuperar, { color: colors.link }]}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.principal }, loading && styles.buttonDisabled]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>
              {loading ? "Cargando..." : "Ingresar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={[styles.link, { color: colors.link }]}>
              ¿No tienes cuenta? Regístrate
            </Text>
          </TouchableOpacity>
        </View>

        <Loader visible={loading} />
      </View>
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    inset: 0,
    margin: "auto",
    width: 350,
    height: 375,
    paddingHorizontal: 24,
    paddingTop: 30,
    borderRadius: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 25,
  },
  form: {
    gap: 12,
  },
  input: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.blanco,
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
  linkRecuperar: {
    fontSize: 12,
    marginTop: -10,
  }
});