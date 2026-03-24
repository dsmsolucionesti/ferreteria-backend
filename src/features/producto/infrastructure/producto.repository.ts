import { BaseRepository } from "../../../shared/base.repository";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";
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

  async create(data: Partial<Producto>): Promise<RespuestaProceso<Producto>> {
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
        dsEstado: "Ok",
        totalRegistros: 1,
        datos: result,
      });
    } catch (error) {
      return new RespuestaProceso({
        idEstado: 1,
        dsEstado: "Error ",
        totalRegistros: 0,
        mensaje: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
