import { supabase } from "./supabase";

export const updateName = async (id: string, nombre: string) => {
    const { error } = await supabase
        .from("usuarios")
        .update({ nombre })
        .eq("id", id);

    return { error };
};