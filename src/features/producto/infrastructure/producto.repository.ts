import { BaseRepository } from "../../../shared/base.repository";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
import { buildSelectWithFilters } from "../../../shared/query.builder";
import { ProductoRepositoryInterface } from "../interfaces/producto.repository.interface";
import { Producto } from "../model/producto.model";

export class ProductoRepository
  extends BaseRepository
  implements ProductoRepositoryInterface
{
  private readonly tableName = "productos";

  async findAll(): Promise<RespuestaProceso<Producto[]>> {
    try {
      const query = `
      SELECT 
        p.activo,
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock_actual,
        c.id AS categoria_id,
        c.nombre AS categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON c.id = p.id_categoria
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
        const { categoria_id, categoria_nombre, ...producto } = p;

        return {
          ...producto,
          categoria: {
            id: categoria_id,
            nombre: categoria_nombre,
          },
        };
      });

      return new RespuestaProceso({
        idEstado: 0,
        dsEstado: "Ok",
        totalRegistros: data.length,
        datos: data,
      });
    } catch (error) {
      return new RespuestaProceso({
        idEstado: 1,
        dsEstado: "Error",
        totalRegistros: 0,
        mensaje: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async findById(id: number): Promise<RespuestaProceso<Producto>> {
    try {
      const query = buildSelectWithFilters(this.tableName, "id", id);
      const result = await this.query<Producto>(query.text);

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

  async post(data: Partial<Producto>): Promise<RespuestaProceso> {
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

  async update(
    id: number,
    data: Partial<Producto>,
  ): Promise<RespuestaProceso> {
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
