import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
import { BaseRepository } from "../../../shared/base.repository";
import { CotizacionRepositoryInterface } from "../interfaces/cotizacion.repository.interface";
import { Cotizacion } from "../models/cotizacion.model";

export class CotizacionRepository
  extends BaseRepository
  implements CotizacionRepositoryInterface
{
  private readonly tableName = "cotizaciones";

  async findAll(): Promise<RespuestaProceso<Cotizacion[]>> {
    try {
      const result = await this.selectEntity<Cotizacion>(this.tableName);

      if (!result[0]) {
        return new RespuestaProceso({
          idEstado: 1,
          dsEstado: "Sin registros",
          totalRegistros: 0,
          datos: [],
        });
      }

      return new RespuestaProceso<Cotizacion[]>({
        idEstado: 0,
        dsEstado: "OK",
        totalRegistros: result.length,
        datos: [result],
      });
    } catch (error) {
      return new RespuestaProceso({
        idEstado: -1,
        dsEstado: "Error",
        mensaje: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async findById(id: number): Promise<RespuestaProceso<Cotizacion>> {
    try {
      const result = await this.selectEntityById<Cotizacion>(this.tableName, id);

      if (!result[0]) {
        return new RespuestaProceso({
          idEstado: 1,
          dsEstado: "Sin registros",
          totalRegistros: 0,
          datos: [],
        });
      }

      return new RespuestaProceso({
        idEstado: 0,
        dsEstado: "OK",
        totalRegistros: 1,
        datos: [result[0]],
      });
    } catch (error) {
      return new RespuestaProceso({
        idEstado: -1,
        dsEstado: "Error",
        mensaje: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async post(data: Partial<Cotizacion>): Promise<RespuestaProceso> {
    try {
      const result = await this.insertEntity(this.tableName, data);

      if (!result[0]) {
        return new RespuestaProceso({
          idEstado: 1,
          dsEstado: "Sin registros",
          totalRegistros: 0,
          datos: [],
        });
      }

      return new RespuestaProceso({
        idEstado: 0,
        dsEstado: "OK",
        datos: [result[0]],
      });
    } catch (error) {
      return new RespuestaProceso({
        idEstado: -1,
        dsEstado: "Error",
        mensaje: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async update(id: number, data: Partial<Cotizacion>): Promise<RespuestaProceso> {
    try {
      const result = await this.updateEntity(this.tableName, data, id);

      if (!result[0]) {
        return new RespuestaProceso({
          idEstado: 1,
          dsEstado: "Sin registros",
          totalRegistros: 0,
          datos: [],
        });
      }

      return new RespuestaProceso({
        idEstado: 0,
        dsEstado: "OK",
        datos: [result[0]],
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
    try {
      const rows = await this.deleteEntity(this.tableName, id);

      if (rows.length === 0) {
        return new RespuestaProceso({
          idEstado: 1,
          dsEstado: "Sin registros",
          totalRegistros: 0,
          datos: [],
        });
      }

      return new RespuestaProceso({
        idEstado: 0,
        dsEstado: "OK",
        totalRegistros: rows.length,
        datos: rows,
      });
    } catch (error) {
      return new RespuestaProceso({
        idEstado: -1,
        dsEstado: "Error",
        mensaje: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
