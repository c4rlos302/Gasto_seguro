import { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { register } from '../../src/services/auth.service';
import { router } from 'expo-router';
import { Loader } from '../../components/loader';
import { useTheme } from '@/src/context/ThemeContext';
import { darkColors, lightColors } from '@/constants/theme';
import { CardContainer } from '@/components/ui/Card';
import { Colors } from '@/constants/colors';

export default function RegisterScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (loading) return;

    if (!email || !password || !confirmPassword || !nombre) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    } else if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    const { error } = await register(email, password, nombre);

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert('Éxito', 'Usuario registrado');
    router.replace('/(auth)/login');
  };

  return (
    <CardContainer style={{ position: "relative" }}>
      <View style={[styles.container, { backgroundColor: colors.secundario }]}>

        <Text style={[styles.title, { color: colors.text }]}>Crear cuenta</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>Regístrate para comenzar</Text>

        <View style={styles.form}>
          <TextInput
            placeholder="Nombre completo"
            placeholderTextColor={colors.text}
            value={nombre}
            onChangeText={setNombre}
            style={
              [styles.input,
              { color: colors.text, backgroundColor: colors.fondo, borderColor: colors.principal }]
            }
          />

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

          <TextInput
            placeholder="Confirmar contraseña"
            placeholderTextColor={colors.text}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={
              [styles.input,
              { color: colors.text, backgroundColor: colors.fondo, borderColor: colors.principal }]
            }
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.principal }, loading && styles.buttonDisabled]}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creando cuenta..." : "Registrarse"}
            </Text>
          </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={[styles.link, { color: colors.link }]}>
            ¿Ya tienes cuenta? Inicia sesión
          </Text>
        </TouchableOpacity>
        </View>
      </View>
      <Loader visible={loading} />
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    inset: 0,
    margin: "auto",
    width: 350,
    height: 480,
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