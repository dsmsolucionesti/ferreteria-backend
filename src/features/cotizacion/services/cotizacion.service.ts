import { CotizacionRepositoryInterface } from "../interfaces/cotizacion.repository.interface";
import { Cotizacion } from "../models/cotizacion.model";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
import { executeInTransaction } from "../../../shared/helper/execute-in-transaction.helper";
import { CotizacionRequest } from "../models/cotizacion-request.model";
import { DetalleCotizacionRepository } from "../../detalle-cotizacion/infrastructure/detalle-cotizacion.repository";

export class CotizacionService {
  private _detalleCotizacionRepository = new DetalleCotizacionRepository();

  constructor(
    private readonly _cotizacionRepository: CotizacionRepositoryInterface,
  ) {}

  async findAll(): Promise<RespuestaProceso> {
    return await this._cotizacionRepository.findAll();
  }

  async findById(id: number): Promise<RespuestaProceso> {
    return await this._cotizacionRepository.findById(id);
  }

  async post(data: Partial<CotizacionRequest>): Promise<RespuestaProceso> {
    try {
      return await executeInTransaction(async (client) => {
        const cabecera = {
          id_cliente: data.idCliente!,
          id_usuario: data.idUsuario!,
          total: 0,
        };

        const result = await this._cotizacionRepository.post(
          cabecera as any,
          client,
        );

        if (result.idEstado !== 0) {
          throw new Error("Error al crear cotización");
        }

        const cotizacionId = result.datos?.[0].id;
        let total = 0;

        for (const det of data.cotizacionDetalle || []) {
          const productoId = det.idProducto.id;
          const precio = det.precioUnitario;

          if (!productoId || !precio) {
            throw new Error("Detalle inválido");
          }

          const subtotal = det.cantidad * precio;
          total += subtotal;

          await this._detalleCotizacionRepository.post(
            {
              idCotizacion: cotizacionId,
              idProducto: productoId,
              cantidad: det.cantidad,
              precioUnitario: precio,
              subtotal,
            },
            client,
          );
        }
        await this._cotizacionRepository.update(
          cotizacionId,
          { total },
          client,
        );

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
