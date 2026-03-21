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
      const result = await this.selectEntity<Producto[]>(this.tableName);

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
        totalRegistros: result.length,
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
