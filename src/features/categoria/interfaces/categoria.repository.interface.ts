import { Categoria } from "../models/categoria.model";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";

export interface CategoriaRepositoryInterface {
  findAll(): Promise<RespuestaProceso<Categoria[]>>;
  findById(id: number): Promise<RespuestaProceso<Categoria>>;
  searchCategorias(query: string): Promise<RespuestaProceso<Categoria[]>>;
  post(data: Partial<Categoria>): Promise<RespuestaProceso>;
  update(id: number, data: Partial<Categoria>): Promise<RespuestaProceso>;
  delete(id: number): Promise<RespuestaProceso>;
}
