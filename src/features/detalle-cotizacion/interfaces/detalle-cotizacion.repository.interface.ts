import { DetalleCotizacion } from "../models/detalle-cotizacion.model";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
import { PoolClient } from "pg";

export interface DetalleCotizacionRepositoryInterface {
  findAll(client?: PoolClient): Promise<RespuestaProceso<DetalleCotizacion[]>>;
  findById(id: number, client?: PoolClient): Promise<RespuestaProceso<DetalleCotizacion>>;
  post(data: Partial<DetalleCotizacion> | Partial<DetalleCotizacion>[], client?: PoolClient): Promise<RespuestaProceso>;
  update(id: number, data: Partial<DetalleCotizacion>, client?: PoolClient): Promise<RespuestaProceso>;
  delete(id: number, client?: PoolClient): Promise<RespuestaProceso>;
}
