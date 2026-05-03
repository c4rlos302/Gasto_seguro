import { useEffect, useState } from 'react';
import { getUser } from '../services/auth.service';

export function useUser() {
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    getUser().then(({ data }) => {
      setUsuario(data);
    });
  }, []);

  return { usuario };
}