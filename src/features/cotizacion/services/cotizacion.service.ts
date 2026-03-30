import { CotizacionRepositoryInterface } from "../interfaces/cotizacion.repository.interface";
import { Cotizacion } from "../models/cotizacion.model";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
import { executeInTransaction } from "../../../shared/helper/execute-in-transaction.helper";
import { CotizacionRequest } from "../models/cotizacion-request.model";
import { DetalleCotizacionRepository } from "../../detalle-cotizacion/infrastructure/detalle-cotizacion.repository";
import { EmailService } from "../../../shared/services/email.service";

export class CotizacionService {
  private _detalleCotizacionRepository = new DetalleCotizacionRepository();
  private _emailService = new EmailService();

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

  async update(id: number, data: any): Promise<RespuestaProceso> {
    if (!id || id === 0) {
      return this.crearRespuestaError("ID de cotización no válido");
    }

    try {
      return await executeInTransaction(async (client) => {
        const existe = await this._cotizacionRepository.findById(id, client);

        if (!existe.datos) {
          throw new Error("Cotización no existe");
        }

        const cabecera = {
          id_cliente: data.idCliente!,
          id_usuario: data.idUsuario!,
        };

        await this._cotizacionRepository.update(id, cabecera, client);

        await this._detalleCotizacionRepository.deleteByCotizacionId(
          id,
          client,
        );

        let total = 0;

        for (const det of data.cotizacionDetalle || []) {
          const productoId = det.id_producto;
          const precio = det.precioUnitario;

          if (!productoId || precio == null) {
            throw new Error("Detalle inválido");
          }

          const subtotal = det.cantidad * precio;
          total += subtotal;

          await this._detalleCotizacionRepository.post(
            {
              idCotizacion: id,
              idProducto: productoId,
              cantidad: det.cantidad,
              precioUnitario: precio,
              subtotal,
            },
            client,
          );
        }

        await this._cotizacionRepository.update(id, { total }, client);

        return new RespuestaProceso({
          idEstado: 0,
          dsEstado: "Cotización actualizada correctamente",
        });
      });
    } catch (error) {
      return new RespuestaProceso({
        idEstado: -1,
        dsEstado: "Error",
        mensaje: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async delete(id: number): Promise<RespuestaProceso> {
    const deleted = await this._cotizacionRepository.delete(id);
    if (deleted.idEstado === 1) {
      return this.crearRespuestaError("Cotización no encontrada");
    }

    return deleted;
  }

  async updateEstado(id: number, data: any): Promise<RespuestaProceso> {
    try {
      return await executeInTransaction(async (client) => {
        const result = await this._cotizacionRepository.updateEstado(
          id,
          data.nuevo_estado,
          client,
        );

        if (result.idEstado !== 0) {
          throw new Error(result.dsEstado);
        }

        this._emailService.sendEmail(data);

        return new RespuestaProceso({
          idEstado: 0,
          dsEstado: "Cotización actualizada correctamente",
        });
      });
    } catch (error) {
      return new RespuestaProceso({
        idEstado: -1,
        dsEstado: "Error",
        mensaje: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async vencerCotizaciones(): Promise<RespuestaProceso> {
    try {
      const actualizadas =
        await this._cotizacionRepository.vencerCotizaciones();

      return new RespuestaProceso({
        idEstado: 0,
        dsEstado: "OK",
        totalRegistros: actualizadas,
        mensaje:
          actualizadas > 0
            ? "Cotizaciones vencidas actualizadas"
            : "No hay cotizaciones para vencer",
        datos: [],
      });
    } catch (error) {
      console.error(error);

      return new RespuestaProceso({
        idEstado: -1,
        dsEstado: "ERROR",
        mensaje: "Error al procesar cotizaciones vencidas",
      });
    }
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
