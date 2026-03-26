import { Categoria } from "../../categoria/models/categoria.model";

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio?: number;
  stockActual?: number;
  idCategoria: Categoria;
  activo?: boolean;
}
