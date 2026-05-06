import { supabase } from "./supabase";

export const getCategorias = async (tipo: any) => {
  return await supabase
    .from("categorias")
    .select("*")
    .eq("tipo", tipo);
};

export const createCategoria = async (categoria: any) => {
  const { data: userData } = await supabase.auth.getUser();

  return await supabase.from("categorias").insert({
    ...categoria,
    usuario_id: userData.user?.id,
  });
};

export const deleteCategoria = async (id: string) => {
  return await supabase
    .from("categorias")
    .delete()
    .eq("id", id);
};

export const updateCategoria = async (id: string, data: any) => {
  return await supabase
    .from("categorias")
    .update(data)
    .eq("id", id);
};