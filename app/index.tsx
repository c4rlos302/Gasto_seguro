import { Redirect } from 'expo-router';
import { useAuth } from '../src/hooks/useAuth';
import { Loader } from '@/components/loader';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Loader visible={loading}/>
    )
  }

  if (user) {
    return <Redirect href="/(tabs)/inicio" />;
  }

  return <Redirect href="/(auth)/login" />;
}