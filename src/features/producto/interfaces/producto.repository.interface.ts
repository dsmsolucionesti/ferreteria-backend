import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
import { Producto } from "../model/producto.model";

export interface ProductoRepositoryInterface {
  findAll(): Promise<RespuestaProceso<Producto[]>>;
  findById(id: number): Promise<RespuestaProceso<Producto>>;
  post(data: Partial<Producto>): Promise<RespuestaProceso>;
  update(id: number, data: Partial<Producto>): Promise<RespuestaProceso>;
  delete(id: number): Promise<RespuestaProceso>;
}
