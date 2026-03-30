import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
import { BaseRepository } from "../../../shared/base.repository";
import { CotizacionRepositoryInterface } from "../interfaces/cotizacion.repository.interface";
import { Cotizacion } from "../models/cotizacion.model";
import { PoolClient } from "pg";
import { CotizacionRequest } from "../models/cotizacion-request.model";

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
      ORDER BY c.id ASC;
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
          cliente_id,
          cliente_nombre,
          usuario_id,
          usuario_nombre,
          estado_cotizacion_id,
          estado_cotizacion_nombre,
          ...cotizacion
        } = p;

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
      const query = `
      SELECT 
        c.*,
        cd.id as cotizacion_detalle_id,
        cd.id_producto as cotizaccion_detalle_id_producto,
        cd.cantidad as cotizacion_cantidad,
        cd.precio_unitario as cotizacion_precio_unitario,
        cd.subtotal as cotizacion_subtotal,
        p.nombre as cotizaccion_detalle_nombre_producto,
        u.id as usuario_id,
        u.nombre as usuario_nombre,
        ec.nombre as estado_cotizacion_nombre,
        cl.nombre as cliente_nombre,
        cl.rut as cliente_rut,
        cl.email as cliente_email
        FROM cotizaciones c 
        FULL JOIN cotizacion_detalle cd on c.id = cd.id_cotizacion
        FULL JOIN productos p on cd.id_producto = p.id
        FULL JOIN usuarios u on u.id = c.id_usuario
        FULL JOIN estados_cotizacion ec on ec.id = c.id_estado
        FULL JOIN clientes cl on cl.id = c.id_cliente
        WHERE c.id = $1
        ORDER BY cd.id ASC;
      `;

      const result = await this.query<any>(query, [id], client);

      if (!result[0]) {
        return new RespuestaProceso({
          idEstado: 1,
          dsEstado: "Sin registros",
          totalRegistros: 0,
          datos: [],
        });
      }

      const cabecera = result[0];
      const cotizacion: any = {
        id: cabecera.id,
        cliente: {
          id: cabecera.id_cliente,
          nombre: cabecera.cliente_nombre,
          rut: cabecera.cliente_rut,
          email: cabecera.cliente_email,
        },
        fecha: cabecera.fecha,
        total: cabecera.total,
        estado: {
          id: cabecera.id_estado,
          nombre: cabecera.estado_cotizacion_nombre,
        },
        usuario: {
          id: cabecera.usuario_id,
          nombre: cabecera.usuario_nombre,
        },
        detalles: [],
      };

      result.forEach((c) => {
        if (!c.cotizacion_detalle_id) return;

        cotizacion.detalles.push({
          id: c.cotizacion_detalle_id,
          id_producto: c.cotizaccion_detalle_id_producto,
          nombre_producto: c.cotizaccion_detalle_nombre_producto,
          cantidad: c.cotizacion_cantidad,
          precioUnitario: c.cotizacion_precio_unitario,
          subtotal: c.cotizacion_subtotal,
        });
      });

      return new RespuestaProceso({
        idEstado: 0,
        dsEstado: "OK",
        totalRegistros: 1,
        datos: cotizacion,
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
    data: Partial<CotizacionRequest>,
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
    data: any,
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

  async updateEstado(
    id: number,
    data: any,
    client?: PoolClient,
  ): Promise<RespuestaProceso> {
    try {
      const rows = await this.updateEntity(
        this.tableName,
        { id_estado: data },
        id,
        client,
      );

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
