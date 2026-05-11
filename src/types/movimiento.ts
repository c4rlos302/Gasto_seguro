export interface Movimiento {
  id: string;
  usuario_id: string;
  categoria_id: string;
  tipo: "gasto" | "ingreso";
  monto: string;
  descripcion?: string;
  fecha: string;
  created_at?: string;
}