import { supabase } from "./supabase";
import dayjs from "dayjs";

export async function generarMovimientosAutomaticos() {

    const hoy = dayjs();

    const { data: recurrentes, error } = await supabase
        .from("movimientos_recurrentes")
        .select("*")
        .eq("activo", true);

    if (error || !recurrentes) return;

    for (const mov of recurrentes) {

        let ultima = mov.ultima_generacion
            ? dayjs(mov.ultima_generacion)
            : undefined;

        while (true) {

            let siguiente;

            if (!ultima) {
                // primera generación → usa fecha_inicio
                siguiente = dayjs(mov.fecha_inicio);
            } else {

                switch (mov.frecuencia) {
                    case "diario":
                        siguiente = ultima.add(1, "day");
                        break;
                    case "semanal":
                        siguiente = ultima.add(1, "week");
                        break;
                    case "quincenal":
                        siguiente = ultima.add(15, "day");
                        break;
                    case "mensual":
                        siguiente = ultima.add(1, "month");
                        break;
                    case "anual":
                        siguiente = ultima.add(1, "year");
                        break;
                }
            }

            if (siguiente?.isAfter(hoy, "day")) break;

            await supabase.from("movimientos").insert({
                usuario_id: mov.usuario_id,
                categoria_id: mov.categoria_id,
                tipo: mov.tipo,
                monto: mov.monto,
                descripcion: mov.descripcion,
                fecha: siguiente?.format("YYYY-MM-DD"),
            });

            ultima = siguiente;
        }

        await supabase
            .from("movimientos_recurrentes")
            .update({
                ultima_generacion: ultima?.format("YYYY-MM-DD")
            })
            .eq("id", mov.id);
    }
}

export const getRecurrentes = async () => {

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            data: [],
            error: "No autenticado"
        };
    }

    return await supabase
        .from("movimientos_recurrentes")
        .select(`
            *,
            categorias(nombre)
        `)
        .eq("usuario_id", user.id)
        .order("created_at", {
            ascending: false
        });
};

export const addRecurrente = async (data: any) => {
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            data: null,
            error: "No autenticado"
        };
    }

    const res = await supabase
        .from("movimientos_recurrentes")
        .insert({
            ...data,
            usuario_id: user.id,
        });

    if (res.error) {
        console.log(
            "Error insertando recurrente:",
            res.error
        );
    }

    return res;
};

export const updateRecurrente = async (
    id: string,
    data: any
) => {

    const res = await supabase
        .from("movimientos_recurrentes")
        .update(data)
        .eq("id", id);

    if (res.error) {
        console.log(
            "Error actualizando recurrente:",
            res.error
        );
    }

    return res;
};

export const deleteRecurrente = async (
    id: string
) => {

    const res = await supabase
        .from("movimientos_recurrentes")
        .delete()
        .eq("id", id);

    if (res.error) {
        console.log(
            "Error eliminando recurrente:",
            res.error
        );
    }

    return res;
};