import { pool } from "../../../config/database";
import { Categoria } from "../models/categoria.model";
import { CategoriaRepositoryInterface } from "../interfaces/categoria.repository.interface";

export class CategoriaRepository implements CategoriaRepositoryInterface {
  async findAll(): Promise<Categoria[]> {
    const result = await pool.query("SELECT * FROM categorias");
    return result.rows;
  }
}
