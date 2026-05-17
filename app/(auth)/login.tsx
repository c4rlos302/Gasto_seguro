import { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { login } from '../../src/services/auth.service';
import { router } from 'expo-router';
import { Loader } from '../../components/loader';
import { StyleSheet } from 'react-native';
import { darkColors, lightColors } from '@/constants/theme';
import { useTheme } from '@/src/context/ThemeContext';
import { CardContainer } from '@/components/ui/Card';
import { Colors } from '@/constants/colors';

export default function LoginScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo');
      return;
    } else if (!password) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña');
      return;
    }

    setLoading(true);

    const { error } = await login(email, password);

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    router.replace('/(tabs)/inicio');
  };

  return (
    <CardContainer style={{ position: "relative" }}>
      <View style={[styles.container, { backgroundColor: colors.secundario }]}>

        <Text style={[styles.title, { color: colors.text }]}>Gasto Seguro</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>Inicia sesión para continuar</Text>

        <View style={styles.form}>
          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor={colors.text}
            value={email}
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
            value={password}
            onChangeText={setPassword}
            style={
              [styles.input,
              { color: colors.text, backgroundColor: colors.fondo, borderColor: colors.principal }]
            }
          />

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
    height: 365,
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
    color: '#994B4C1',
    fontWeight: '500',
  },
});