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
      const query = `
      SELECT 
        c.id,
        c.fecha,
        c.total,
        cl.id as cliente_id,
        cl.nombre as cliente_nombre,
        u.id as usuario_id,
        u.nombre as usuario_nombre,
        ec.id as estado_cotizacion_id,
        ec.nombre as estado_cotizacion_nombre
      FROM cotizaciones c
      LEFT JOIN clientes cl ON c.id_cliente = cl.id 
      LEFT JOIN usuarios u on c.id_usuario = u.id 
      LEFT JOIN estados_cotizacion ec on c.id_estado = ec.id
    `;

      const result = await this.query<any>(query);

      if (!result[0]) {
        return new RespuestaProceso({
          idEstado: 1,
          dsEstado: "Sin registros",
          totalRegistros: 0,
          datos: [],
        });
      }

      const data = result.map((p) => {
        const { cliente_id, cliente_nombre, usuario_id, usuario_nombre, estado_cotizacion_id, estado_cotizacion_nombre, ...cotizacion } = p;

        return {
          ...cotizacion,
          cliente: {
            id: cliente_id,
            nombre: cliente_nombre,
          },
          usuario: {
            id: usuario_id,
            nombre: usuario_nombre,
          },
          estadoCotizacion: {
            id: estado_cotizacion_id,
            nombre: estado_cotizacion_nombre,
          },
        };
      });

      return new RespuestaProceso<Cotizacion[]>({
        idEstado: 0,
        dsEstado: "OK",
        totalRegistros: data.length,
        datos: data,
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
