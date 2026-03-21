import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
import { Producto } from "../model/producto.model";

export interface ProductoRepositoryInterface {
  findAll(): Promise<RespuestaProceso<Producto[]>>;
  create(data: Partial<Producto>): Promise<RespuestaProceso<Producto>>;
}