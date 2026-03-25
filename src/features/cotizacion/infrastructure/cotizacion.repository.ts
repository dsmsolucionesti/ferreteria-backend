import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
import { BaseRepository } from "../../../shared/base.repository";
import { CotizacionRepositoryInterface } from "../interfaces/cotizacion.repository.interface";
import { Cotizacion } from "../models/cotizacion.model";
import { PoolClient } from "pg";

export class CotizacionRepository
  extends BaseRepository
  implements CotizacionRepositoryInterface
{
  private readonly tableName = "cotizaciones";

  async findAll(client?: PoolClient): Promise<RespuestaProceso<Cotizacion[]>> {
    try {
      const result = await this.selectEntity<Cotizacion>(this.tableName, client);

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

  async findById(
    id: number,
    client?: PoolClient,
  ): Promise<RespuestaProceso<Cotizacion>> {
    try {
      const result = await this.selectEntityById<Cotizacion>(
        this.tableName,
        id,
        client,
      );

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

  async post(
    data: Partial<Cotizacion>,
    client?: PoolClient,
  ): Promise<RespuestaProceso> {
    try {
      const result = await this.insertEntity(this.tableName, data, client);

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

  async update(
    id: number,
    data: Partial<Cotizacion>,
    client?: PoolClient,
  ): Promise<RespuestaProceso> {
    try {
      const result = await this.updateEntity(this.tableName, data, id, client);

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

  async delete(id: number, client?: PoolClient): Promise<RespuestaProceso> {
    try {
      const rows = await this.deleteEntity(this.tableName, id, client);

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
