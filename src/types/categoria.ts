export interface Categoria {
  id: string;
  nombre: string;
  tipo: "gasto" | "ingreso";
  usuario_id: string;
}