import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useUser } from '../../src/hooks/useUser';
import { CardContainer } from '@/components/ui/Card';
import Header from '@/components/ui/Header';
import { router } from 'expo-router';

export default function inicio() {
  const { usuario } = useUser();

  const irACategorias = () => {
    router.navigate("/categorias");
  }
  return (
    <CardContainer>
      <Header title={`Hola, ${usuario?.nombre}`} />
      
      <TouchableOpacity onPress={irACategorias}>
        <Text>Ir a Categorias</Text>
      </TouchableOpacity>
    </CardContainer>
  );
}
const styles = StyleSheet.create({
  
});