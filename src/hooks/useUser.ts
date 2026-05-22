import { useEffect, useState } from 'react';
import { getUser } from '../services/auth.service';
import { updateName } from '../services/usuario.service';

export function useUser() {
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data } = await getUser();

    if (data) {
      setUsuario(data);
    }
  };

  const editNombre = async (nombre: string) => {
    if (!usuario?.id) return;
    const { error } = await updateName(usuario.id, nombre);

    if (!error) {
      setUsuario((prev: any) => ({
        ...prev,
        nombre,
      }));
    }

    return { error };
  };

  return {
    usuario,
    editNombre,
    loadUser,
  };
}