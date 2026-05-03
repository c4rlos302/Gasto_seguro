import { useEffect, useState } from "react";
import {
  getCategorias,
  createCategoria,
  deleteCategoria,
  updateCategoria,
} from "../services/categorias.service";

export function useCategorias() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategorias = async () => {
    setLoading(true);

    const res = await getCategorias();
    console.log("RES:", res);
    console.log("DATA:", res?.data);

    if (!res) return;
    const { data, error } = res;

    if (!error) {
      setCategorias(data);
    }

    setLoading(false);
  };

  const addCategoria = async (categoria: any) => {
    const { error } = await createCategoria(categoria);
    if (!error) fetchCategorias();
  };

  const removeCategoria = async (id: string) => {
    const { error } = await deleteCategoria(id);
    if (!error) fetchCategorias();
  };

  const editCategoria = async (id: string, data: any) => {
    const { error } = await updateCategoria(id, data);
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