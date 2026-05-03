import { supabase } from "./supabase";

export const getMovimientos = async () => {
  const { data, error } = await supabase
    .from("movimientos")
    .select("*")
    .order("fecha", { ascending: false });
  return { data, error };
};

export const createMovimiento = async (movimiento: any) => {
  const { data: userData } = await supabase.auth.getUser();

  return await supabase.from("movimientos").insert({
    ...movimiento,
    usuario_id: userData.user?.id,
  });
};

export const deleteMovimiento = async (id: string) => {
  return await supabase
    .from("movimientos")
    .delete()
    .eq("id", id);
};

export const updateMovimiento = async (id: string, data: any) => {
  return await supabase
    .from("movimientos")
    .update(data)
    .eq("id", id);
};