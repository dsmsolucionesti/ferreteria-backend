import { CotizacionRepositoryInterface } from "../interfaces/cotizacion.repository.interface";
import { Cotizacion } from "../models/cotizacion.model";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
import { pool } from "../../../config/database";
import { executeInTransaction } from "../../../shared/helper/execute-in-transaction.helper";

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
    try {
      return await executeInTransaction(async (client) => {
        const result = await this._cotizacionRepository.post(data, client);

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
    data: Partial<Cotizacion>,
  ): Promise<RespuestaProceso> {
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
