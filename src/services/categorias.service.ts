import { supabase } from "./supabase";

export const getCategorias = async (tipo?: string) => {
  let query = supabase
    .from("categorias")
    .select("*")
    .order("nombre")
  if (tipo) {
    query = query.eq("tipo", tipo);
  }
  return await query;
};

export const createCategoria = async (nombre: string, tipo: string) => {
  const { data: userData } = await supabase.auth.getUser();

  return await supabase.from("categorias").insert({
    nombre,
    tipo,
    usuario_id: userData.user?.id,
  });
};

export const deleteCategoria = async (id: string) => {
  return await supabase
    .from("categorias")
    .delete()
    .eq("id", id);
};

export const updateCategoria = async (id: string, nombre: string, tipo: string) => {
  return await supabase
    .from("categorias")
    .update({nombre, tipo})
    .eq("id", id);
};