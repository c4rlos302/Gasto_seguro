import { Redirect } from 'expo-router';
import { useAuth } from '../src/hooks/useAuth';
import { useEffect, useState } from 'react';
import PantallaDeCarga from './pantallaDeCarga';

export default function Index() {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);

  }, []);

  if (loading || showSplash) {
  return <PantallaDeCarga visible={true}/>
  }

  if (user) {
    return <Redirect href="/(tabs)/inicio" />;
  }

  return <Redirect href="/(auth)/login" />;
}