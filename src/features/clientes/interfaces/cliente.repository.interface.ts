import { Cliente } from "../models/cliente.model";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";

export interface ClienteRepositoryInterface {
  findAll(): Promise<RespuestaProceso<Cliente[]>>;
  findById(id: number): Promise<RespuestaProceso<Cliente>>;
  post(data: Partial<Cliente>): Promise<RespuestaProceso>;
  update(id: number, data: Partial<Cliente>): Promise<RespuestaProceso>;
  delete(id: number): Promise<RespuestaProceso>;
}
