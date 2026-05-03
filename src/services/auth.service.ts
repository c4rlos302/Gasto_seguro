import { supabase } from './supabase';

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const logout = async () => {
  await supabase.auth.signOut();
};

export const register = async (
  email: string,
  password: string,
  nombre: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return { error };

  const user = data.user;

  if (user) {
    await supabase.from('usuarios').insert([
      {
        id: user.id,
        nombre,
        correo: email,
      },
    ]);
  }

  return { data };
};

export const getUser = async () => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .single();

  return { data, error };
};