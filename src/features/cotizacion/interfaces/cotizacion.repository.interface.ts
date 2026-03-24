import { Cotizacion } from "../models/cotizacion.model";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";

export interface CotizacionRepositoryInterface {
  findAll(): Promise<RespuestaProceso<Cotizacion[]>>;
  findById(id: number): Promise<RespuestaProceso<Cotizacion>>;
  post(data: Partial<Cotizacion>): Promise<RespuestaProceso>;
  update(id: number, data: Partial<Cotizacion>): Promise<RespuestaProceso>;
  delete(id: number): Promise<RespuestaProceso>;
}
