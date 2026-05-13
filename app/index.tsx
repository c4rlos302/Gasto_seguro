import { Redirect } from 'expo-router';
import { useAuth } from '../src/hooks/useAuth';
import { Loader } from '@/components/loader';
import { useEffect, useState } from 'react';

export default function Index() {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);

  }, []);

  if (loading || showSplash) {
  return <Loader visible={true}/>
  }

  if (user) {
    return <Redirect href="/(tabs)/inicio" />;
  }

  return <Redirect href="/(auth)/login" />;
}