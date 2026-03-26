import { DetalleCotizacion } from "../models/detalle-cotizacion.model";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
import { executeInTransaction } from "../../../shared/helper/execute-in-transaction.helper";
import { DetalleCotizacionRepositoryInterface } from "../interfaces/detalle-cotizacion.repository.interface";

export class DetalleCotizacionService {
  constructor(
    private readonly _detalleCotizacionRepository: DetalleCotizacionRepositoryInterface,
  ) {}

  async findAll(): Promise<RespuestaProceso> {
    return await this._detalleCotizacionRepository.findAll();
  }

  async findById(id: number): Promise<RespuestaProceso> {
    return await this._detalleCotizacionRepository.findById(id);
  }

  async post(data: Partial<DetalleCotizacion>): Promise<RespuestaProceso> {
    try {
      return await executeInTransaction(async (client) => {
        const result = await this._detalleCotizacionRepository.post(data, client);

        if (result.idEstado !== 0) {
          throw new Error("Error al crear cotización");
        }

        return result;
      });
    } catch (error) {
      return new RespuestaProceso({
        idEstado: -1,
        dsEstado: "Error",
        mensaje: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async update(
    id: number,
    data: Partial<DetalleCotizacion>,
  ): Promise<RespuestaProceso> {
    if (id === 0) {
      return this.crearRespuestaError("ID de cotización no válido");
    }
    return await this._detalleCotizacionRepository.update(id, data);
  }

  async delete(id: number): Promise<RespuestaProceso> {
    const deleted = await this._detalleCotizacionRepository.delete(id);
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
