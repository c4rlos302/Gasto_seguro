import { useEffect, useState } from "react";
import {
  getMovimientos,
  createMovimiento,
  deleteMovimiento,
  updateMovimiento,
} from "../services/movimientos.service";

export function useMovimientos() {
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMovimientos = async () => {
    setLoading(true);

    const { data, error } = await getMovimientos();

    if (!error) {
      setMovimientos(data || []);
    }

    setLoading(false);
  };

  const addMovimiento = async (movimiento: any) => {
    const { error } = await createMovimiento(movimiento);
    if (!error) fetchMovimientos();
  };

  const removeMovimiento = async (id: string) => {
    const { error } = await deleteMovimiento(id);
    if (!error) fetchMovimientos();
  };

  const editMovimiento = async (id: string, data: any) => {
    const { error } = await updateMovimiento(id, data);
    if (!error) fetchMovimientos();
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

  return {
    movimientos,
    loading,
    fetchMovimientos,
    addMovimiento,
    removeMovimiento,
    editMovimiento,
  };
}