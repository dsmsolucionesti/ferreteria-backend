import { CotizacionRepositoryInterface } from "../interfaces/cotizacion.repository.interface";
import { Cotizacion } from "../models/cotizacion.model";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";

export class CotizacionService {
  constructor(
    private readonly _cotizacionRepository: CotizacionRepositoryInterface,
  ) {}

  async findAll(): Promise<RespuestaProceso> {
    return await this._cotizacionRepository.findAll();
  }

  async findById(id: number): Promise<RespuestaProceso> {
    return await this._cotizacionRepository.findById(id);
  }

  async post(data: Partial<Cotizacion>): Promise<RespuestaProceso> {
    return await this._cotizacionRepository.post(data);
  }

  async update(id: number, data: Partial<Cotizacion>): Promise<RespuestaProceso> {
    if (id === 0) {
      return this.crearRespuestaError("ID de cotización no válido");
    }
    return await this._cotizacionRepository.update(id, data);
  }

  async delete(id: number): Promise<RespuestaProceso> {
    const deleted = await this._cotizacionRepository.delete(id);
    if (deleted.idEstado === 1) {
      return this.crearRespuestaError("Cotización no encontrada");
    }

    return deleted;
  }

  private crearRespuestaError(mensaje: string): RespuestaProceso {
    return new RespuestaProceso({
      idEstado: -1,
      dsEstado: mensaje,
      totalRegistros: 0,
      datos: [],
    });
  }
}
