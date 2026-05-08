import { StyleSheet } from 'react-native';
import { useUser } from '../../src/hooks/useUser';
import { CardContainer } from '@/components/ui/Card';
import Header from '@/components/ui/Header';

export default function inicio() {
  const { usuario } = useUser();

  return (
    <CardContainer>
      <Header title={`Hola, ${usuario?.nombre}`} />
      
    </CardContainer>
  );
}
const styles = StyleSheet.create({
  
});