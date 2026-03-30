import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
import { BaseRepository } from "../../../shared/base.repository";
import { DetalleCotizacionRepositoryInterface } from "../interfaces/detalle-cotizacion.repository.interface";
import { DetalleCotizacion } from "../models/detalle-cotizacion.model";
import { PoolClient } from "pg";

export class DetalleCotizacionRepository
  extends BaseRepository
  implements DetalleCotizacionRepositoryInterface
{
  private readonly tableName = "cotizacion_detalle";

  async findAll(
    client?: PoolClient,
  ): Promise<RespuestaProceso<DetalleCotizacion[]>> {
    try {
      const query = `
      SELECT 
        cd.id,
        cd.id_cotizacion,
        cd.id_producto,
        p.id as producto_id,
        p.nombre as producto_nombre,
        p.precio as producto_precio,
        cd.cantidad,
        cd.precio_unitario,
        cd.subtotal
      FROM cotizacion_detalle cd
      LEFT JOIN cotizaciones c ON cd.id_cotizacion = c.id
      LEFT JOIN productos p ON cd.id_producto = p.id

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
        const {
          producto_id,
          producto_nombre,
          producto_precio,
          ...detalleCotizacion
        } = p;

        return {
          ...detalleCotizacion,
          producto: {
            id: producto_id,
            nombre: producto_nombre,
            precio: producto_precio,
          },
        };
      });

      return new RespuestaProceso<DetalleCotizacion[]>({
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
  ): Promise<RespuestaProceso<DetalleCotizacion>> {
    try {
      const result = await this.selectEntityById<DetalleCotizacion>(
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
    data: Partial<DetalleCotizacion> | Partial<DetalleCotizacion>[],
    client?: PoolClient,
  ): Promise<RespuestaProceso> {
    try {
      const dataArray = Array.isArray(data) ? data : [data];

      const results = [];

      for (const item of dataArray) {
        const mapData = {
          id_cotizacion: item.idCotizacion,
          id_producto: item.idProducto,
          cantidad: item.cantidad,
          precio_unitario: item.precioUnitario,
          subtotal: item.subtotal,
        };
        const result = await this.insertEntity(
          this.tableName,
          mapData as any,
          client,
        );

        if (result[0]) {
          results.push(result[0]);
        }
      }

      if (results.length === 0) {
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
        totalRegistros: results.length,
        datos: results,
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

  async deleteByCotizacionId(
    idCotizacion: number,
    client?: PoolClient,
  ): Promise<void> {
    const query = `
    DELETE FROM cotizacion_detalle
    WHERE id_cotizacion = $1
  `;

    await this.query(query, [idCotizacion], client);
  }
}
