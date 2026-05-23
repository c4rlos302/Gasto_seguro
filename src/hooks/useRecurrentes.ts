import { useState } from "react";
import {
    getRecurrentes,
    addRecurrente,
    updateRecurrente,
    deleteRecurrente
} from "../services/recurrentes.service";

export function useRecurrentes() {

    const [recurrentes, setRecurrentes] = useState<any[]>([]);

    const fetchRecurrentes = async () => {
        const { data } = await getRecurrentes();
        setRecurrentes(data || []);
    };

    const crear = async (data: any) => {
        await addRecurrente(data);
        fetchRecurrentes();
    };

    const editar = async (id: string, data: any) => {
        await updateRecurrente(id, data);
        fetchRecurrentes();
    };

    const eliminar = async (id: string) => {
        await deleteRecurrente(id);
        fetchRecurrentes();
    };

    return {
        recurrentes,
        fetchRecurrentes,
        crear,
        editar,
        eliminar
    };
}