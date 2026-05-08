import { useEffect, useState } from "react";
import {
  getCategorias,
  createCategoria,
  deleteCategoria,
  updateCategoria,
} from "../services/categorias.service";

export function useCategorias(tipo?: string) {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategorias = async () => {
    setLoading(true);

    const res = await getCategorias(tipo);

    if (!res) return;
    const { data, error } = res;

    if (!error) {
      setCategorias(data);
    }

    setLoading(false);
  };

  const addCategoria = async (nombre: string, tipo: string) => {
    const { error } = await createCategoria(nombre, tipo);
    if (!error) fetchCategorias();
  };

  const removeCategoria = async (id: string) => {
    const { error } = await deleteCategoria(id);
    if (!error) fetchCategorias();
  };

  const editCategoria = async (id: string, nombre: string, tipo:string) => {
    const { error } = await updateCategoria(id, nombre, tipo);
    console.log(error);
    if (!error) fetchCategorias();
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return {
    categorias,
    loading,
    fetchCategorias,
    addCategoria,
    removeCategoria,
    editCategoria,
  };
}