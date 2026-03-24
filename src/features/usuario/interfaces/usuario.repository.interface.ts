import { Usuario } from "../models/usuario.model";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";

export interface UsuarioRepositoryInterface {
  findAll(): Promise<RespuestaProceso<Usuario[]>>;
  findById(id: number): Promise<RespuestaProceso<Usuario>>;
  post(data: Partial<Usuario>): Promise<RespuestaProceso>;
  update(id: number, data: Partial<Usuario>): Promise<RespuestaProceso>;
  delete(id: number): Promise<RespuestaProceso>;
}
