import { Usuario } from "../models/usuario.model";
import { UsuarioRepositoryInterface } from "../interfaces/usuario.repository.interface";
import { BaseRepository } from "../../../shared/base.repository";
import { RespuestaProceso } from "../../../shared/models/respuesta-proceso.model";

export class UsuarioRepository
  extends BaseRepository
  implements UsuarioRepositoryInterface
{
  private readonly tableName = "usuarios";

  async findAll(): Promise<RespuestaProceso<Usuario[]>> {
    try {
      const result = await this.selectEntity<Usuario>(this.tableName);

      if (!result[0]) {
        return new RespuestaProceso({
          idEstado: 1,
          dsEstado: "Sin registros",
          totalRegistros: 0,
          datos: [],
        });
      }

      return new RespuestaProceso<Usuario[]>({
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

  async findById(id: number): Promise<RespuestaProceso<Usuario>> {
    try {
      const result = await this.selectEntityById<Usuario>(this.tableName, id);

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

  async post(data: Partial<Usuario>): Promise<RespuestaProceso> {
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

  async update(id: number, data: Partial<Usuario>): Promise<RespuestaProceso> {
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

  async findByEmail(email: string): Promise<Usuario | null> {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE email = '${email}'`;
      const result = await this.query<any>(query);

      if (!result[0]) {
        return null;
      }

      return result[0];
    } catch (error) {
      throw error;
    }
  }
}
