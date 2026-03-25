import { Cotizacion } from "../models/cotizacion.model";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
import { PoolClient } from "pg";

export interface CotizacionRepositoryInterface {
  findAll(client?: PoolClient): Promise<RespuestaProceso<Cotizacion[]>>;
  findById(id: number, client?: PoolClient): Promise<RespuestaProceso<Cotizacion>>;
  post(data: Partial<Cotizacion>, client?: PoolClient): Promise<RespuestaProceso>;
  update(id: number, data: Partial<Cotizacion>, client?: PoolClient): Promise<RespuestaProceso>;
  delete(id: number, client?: PoolClient): Promise<RespuestaProceso>;
}
