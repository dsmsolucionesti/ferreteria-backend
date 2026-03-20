import { pool } from "../../../config/database";
import { Usuario } from "../models/usuario.model";
import { UsuarioRepositoryInterface } from "../interfaces/usuario.repository.interface";

export class UsuarioRepository implements UsuarioRepositoryInterface {
  async findAll(): Promise<Usuario[]> {
    const result = await pool.query("SELECT * FROM usuarios");
    return result.rows;
  }

  async findById(id: number): Promise<Usuario | null> {
    const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
      id,
    ]);
    return result.rows[0] || null;
  }

  async create(usuario: Usuario): Promise<Usuario> {
    const result = await pool.query(
      "INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING *",
      [usuario.nombre, usuario.email]
    );
    return result.rows[0];
  }
}
