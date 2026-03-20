import { BaseRepository } from "../../../shared/base.repository";
import {
  buildDelete,
  buildInsert,
  buildSelect,
  buildSelectWithFilters,
  buildUpdate,
} from "../../../shared/query.builder";
import { Categoria } from "../models/categoria.model";
import { CategoriaRepositoryInterface } from "../interfaces/categoria.repository.interface";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";

export class CategoriaRepository
  extends BaseRepository
  implements CategoriaRepositoryInterface
{
  async findAll(): Promise<RespuestaProceso<Categoria[]>> {
    try {
      const query = buildSelect("categorias");
      const result = await this.query<Categoria[]>(query.text);

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
        totalRegistros: result.length,
        datos: result,
      });
    } catch (error) {
      return new RespuestaProceso({
        idEstado: -1,
        dsEstado: "Error",
        mensaje: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async findById(id: number): Promise<RespuestaProceso<Categoria>> {
    try {
      const query = buildSelectWithFilters("categorias", "id", id);
      const result = await this.query<Categoria>(query.text);

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

  async create(data: Partial<Categoria>): Promise<RespuestaProceso> {
    try {
      const query = buildInsert("categorias", data);
      const result = await this.query<Categoria>(query.text, query.values);

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
    data: Partial<Categoria>,
  ): Promise<RespuestaProceso> {
    try {
      const query = buildUpdate("categorias", data, id);
      const result = await this.query<Categoria>(query.text, query.values);

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
      const query = buildDelete("categorias", "id", id);
      const rows = await this.query<any>(query.text);

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
