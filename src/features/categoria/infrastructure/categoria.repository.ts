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
  private readonly tableName = "categorias";

  async findAll(): Promise<RespuestaProceso<Categoria[]>> {
    try {
      const query = buildSelect(this.tableName);
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
      const query = buildSelectWithFilters(this.tableName, "id", id);
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

  async searchCategorias(query: string): Promise<RespuestaProceso<Categoria[]>> {
    try {
      const result = await this.query<Categoria[]>(
        `
        SELECT *
        FROM ${this.tableName}
        WHERE LOWER(nombre) LIKE LOWER($1)
        ORDER BY nombre ASC
        LIMIT 10
        `,
        [`%${query}%`],
      );

      if (!result || result.length === 0) {
        return new RespuestaProceso({
          idEstado: 1,
          dsEstado: "Sin registros",
          totalRegistros: 0,
          datos: [],
        });
      }

      return new RespuestaProceso<Categoria[]>({
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

  async post(data: Partial<Categoria>): Promise<RespuestaProceso> {
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
    data: Partial<Categoria>,
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
