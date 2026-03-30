import { Cotizacion } from "../models/cotizacion.model";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
import { PoolClient } from "pg";
import { CotizacionRequest } from "../models/cotizacion-request.model";

export interface CotizacionRepositoryInterface {
  findAll(client?: PoolClient): Promise<RespuestaProceso<Cotizacion[]>>;
  findById(id: number, client?: PoolClient): Promise<RespuestaProceso<Cotizacion>>;
  post(data: Partial<CotizacionRequest>, client?: PoolClient): Promise<RespuestaProceso>;
  update(id: number, data: any, client?: PoolClient): Promise<RespuestaProceso>;
  delete(id: number, client?: PoolClient): Promise<RespuestaProceso>;
  updateEstado(id: number, estado: number, client?: PoolClient): Promise<RespuestaProceso>;
}
